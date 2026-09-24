export const ACTION_TYPES = ["copy_then_redirect", "redirect_only"] as const
export type ActionType = (typeof ACTION_TYPES)[number]

export const X_ARTICLES_URL = "https://x.com/compose/articles"
export const MAX_SELF_CONTAINED_CHARS = 1500
export const MAX_CLIPBOARD_CHARS = 200_000
export const MAX_LABEL_CHARS = 120
export const PREVIEW_CHARS = 280

export type ActionLinkPayload = {
  destination_url: string
  clipboard_text?: string
  label?: string
  action_type: ActionType
}

export type ActionLink = ActionLinkPayload & {
  id: string
  created_at: string
}

export type CompactPayload = {
  u: string
  t?: string
  l?: string
  a: "c" | "r"
}

export type ClipboardMode = "split" | "single"

export function isActionType(value: string): value is ActionType {
  return (ACTION_TYPES as readonly string[]).includes(value)
}

export function compactPayload(payload: ActionLinkPayload): CompactPayload {
  const compact: CompactPayload = {
    u: payload.destination_url,
    a: payload.action_type === "redirect_only" ? "r" : "c",
  }
  if (payload.clipboard_text) compact.t = payload.clipboard_text
  if (payload.label) compact.l = payload.label
  return compact
}

export function expandPayload(compact: CompactPayload): ActionLinkPayload {
  return {
    destination_url: compact.u,
    clipboard_text: compact.t,
    label: compact.l,
    action_type: compact.a === "r" ? "redirect_only" : "copy_then_redirect",
  }
}

export function parseDestinationUrl(
  raw: string
): { ok: true; url: string } | { ok: false; error: string } {
  const trimmed = raw.trim()
  if (!trimmed) {
    return { ok: false, error: "Destination URL is required." }
  }

  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    return {
      ok: false,
      error: "Enter a full URL, including https://",
    }
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Destination must be an http or https URL." }
  }

  parsed.hash = ""
  return { ok: true, url: parsed.toString() }
}

export function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

export function composeClipboardText(input: {
  mode: ClipboardMode
  title: string
  body: string
  single: string
}): string | undefined {
  if (input.mode === "single") {
    const text = input.single.trim()
    return text ? text : undefined
  }

  const title = input.title.trim()
  const body = input.body.trim()
  if (title && body) return `${title}\n\n${body}`
  const text = title || body
  return text ? text : undefined
}

export function truncatePreview(text: string, max = PREVIEW_CHARS): string {
  const normalized = text.replace(/\s+/g, " ").trim()
  if (normalized.length <= max) return normalized
  return `${normalized.slice(0, max).trimEnd()}…`
}

export function estimateSelfContainedLength(payload: ActionLinkPayload): number {
  const json = JSON.stringify(compactPayload(payload))
  const payloadChars = Math.ceil((json.length * 4) / 3)
  const signatureChars = 22
  return payloadChars + 1 + signatureChars
}

export function validatePayload(
  input: Partial<ActionLinkPayload>
): { ok: true; payload: ActionLinkPayload } | { ok: false; error: string } {
  const destination = parseDestinationUrl(input.destination_url ?? "")
  if (!destination.ok) return destination

  const actionType = input.action_type ?? "copy_then_redirect"
  if (!isActionType(actionType)) {
    return { ok: false, error: "Action type must be copy_then_redirect or redirect_only." }
  }

  const label = input.label?.trim()
  if (label && label.length > MAX_LABEL_CHARS) {
    return { ok: false, error: `Label must be ${MAX_LABEL_CHARS} characters or fewer.` }
  }

  const clipboard =
    actionType === "redirect_only"
      ? undefined
      : input.clipboard_text?.trim() || undefined

  if (clipboard && clipboard.length > MAX_CLIPBOARD_CHARS) {
    return {
      ok: false,
      error: `Clipboard text must be ${MAX_CLIPBOARD_CHARS.toLocaleString()} characters or fewer.`,
    }
  }

  return {
    ok: true,
    payload: {
      destination_url: destination.url,
      clipboard_text: clipboard,
      label: label || undefined,
      action_type: actionType,
    },
  }
}
