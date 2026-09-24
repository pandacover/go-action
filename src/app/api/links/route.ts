import { NextResponse } from "next/server"
import { getRequestOrigin } from "@/lib/origin"
import { PayloadTooLargeError } from "@/lib/signed-link"
import { isSupabaseConfigured } from "@/lib/supabase"
import { createActionLink } from "@/lib/store"
import { validatePayload, type ActionType } from "@/lib/payload"

export async function GET() {
  return NextResponse.json({
    storage: isSupabaseConfigured() ? "supabase" : "signed",
  })
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Send a JSON body with a destination_url." },
      { status: 400 }
    )
  }

  const record = (body ?? {}) as {
    destination_url?: string
    clipboard_text?: string
    label?: string
    action_type?: ActionType
  }

  const validated = validatePayload(record)
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 })
  }

  try {
    const created = await createActionLink(
      validated.payload,
      getRequestOrigin(request)
    )
    return NextResponse.json(created)
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          length: error.length,
          max: error.max,
        },
        { status: 413 }
      )
    }

    const message =
      error instanceof Error ? error.message : "Could not create the action link."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
