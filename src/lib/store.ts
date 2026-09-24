import "server-only"

import { randomBytes } from "node:crypto"
import {
  buildSelfContainedPath,
  decodeSignedToken,
  SignedLinkError,
} from "@/lib/signed-link"
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase"
import type { ActionLink, ActionLinkPayload } from "@/lib/payload"

const ID_ALPHABET =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

export type CreatedActionLink = {
  id?: string
  url: string
  storage: "supabase" | "signed"
}

function generateId(size = 10): string {
  const bytes = randomBytes(size)
  let id = ""
  for (const byte of bytes) {
    id += ID_ALPHABET[byte % ID_ALPHABET.length]
  }
  return id
}

export async function createActionLink(
  payload: ActionLinkPayload,
  origin: string
): Promise<CreatedActionLink> {
  if (isSupabaseConfigured()) {
    const id = generateId()
    const createdAt = new Date().toISOString()
    const supabase = getSupabaseClient()
    const { error } = await supabase.from("action_links").insert({
      id,
      destination_url: payload.destination_url,
      clipboard_text: payload.clipboard_text ?? null,
      label: payload.label ?? null,
      action_type: payload.action_type,
      created_at: createdAt,
    })

    if (error) {
      throw new Error(
        `Could not save the action link in Supabase: ${error.message}`
      )
    }

    return {
      id,
      url: `${origin}/g/${id}`,
      storage: "supabase",
    }
  }

  const path = buildSelfContainedPath(payload)
  return {
    url: `${origin}${path}`,
    storage: "signed",
  }
}

export async function getActionLinkById(id: string): Promise<ActionLink | null> {
  if (!isSupabaseConfigured()) return null

  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("action_links")
    .select(
      "id, destination_url, clipboard_text, label, action_type, created_at"
    )
    .eq("id", id)
    .maybeSingle()

  if (error) {
    throw new Error(`Could not load the action link: ${error.message}`)
  }

  if (!data) return null

  return {
    id: data.id as string,
    destination_url: data.destination_url as string,
    clipboard_text: (data.clipboard_text as string | null) ?? undefined,
    label: (data.label as string | null) ?? undefined,
    action_type:
      data.action_type === "redirect_only"
        ? "redirect_only"
        : "copy_then_redirect",
    created_at: data.created_at as string,
  }
}

export function getActionLinkFromToken(token: string): ActionLinkPayload {
  return decodeSignedToken(token)
}

export { SignedLinkError, isSupabaseConfigured }
