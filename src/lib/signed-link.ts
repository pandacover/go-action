import "server-only"

import { createHmac, timingSafeEqual } from "node:crypto"
import { gunzipSync, gzipSync } from "node:zlib"
import {
  MAX_SELF_CONTAINED_CHARS,
  compactPayload,
  expandPayload,
  validatePayload,
  type ActionLinkPayload,
  type CompactPayload,
} from "@/lib/payload"

const DEFAULT_DEV_SECRET = "go-action-dev-signing-secret"

export class SignedLinkError extends Error {
  readonly code: "INVALID_TOKEN" | "BAD_SIGNATURE"

  constructor(code: "INVALID_TOKEN" | "BAD_SIGNATURE", message: string) {
    super(message)
    this.code = code
  }
}

export class PayloadTooLargeError extends Error {
  readonly code = "PAYLOAD_TOO_LARGE" as const
  readonly length: number
  readonly max = MAX_SELF_CONTAINED_CHARS

  constructor(length: number) {
    super(
      `Self-contained link is ${length} characters (max ${MAX_SELF_CONTAINED_CHARS}). Configure Supabase to store longer articles.`
    )
    this.length = length
  }
}

function getSigningSecret(): string {
  return process.env.GO_ACTION_SIGNING_SECRET || DEFAULT_DEV_SECRET
}

function sign(payload: string): string {
  return createHmac("sha256", getSigningSecret())
    .update(payload)
    .digest()
    .subarray(0, 16)
    .toString("base64url")
}

function signaturesMatch(actual: string, expected: string): boolean {
  const a = Buffer.from(actual)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

function encodeBody(payload: ActionLinkPayload): string {
  const json = Buffer.from(JSON.stringify(compactPayload(payload)), "utf8")
  const gzipped = gzipSync(json, { level: 9 })
  const raw = gzipped.length < json.length ? gzipped : json
  return raw.toString("base64url")
}

function decodeBody(encoded: string): ActionLinkPayload {
  let bytes: Buffer
  try {
    bytes = Buffer.from(encoded, "base64url")
  } catch {
    throw new SignedLinkError("INVALID_TOKEN", "This action link is malformed.")
  }

  if (!bytes.length) {
    throw new SignedLinkError("INVALID_TOKEN", "This action link is empty.")
  }

  const unzipped =
    bytes[0] === 0x1f && bytes[1] === 0x8b ? gunzipSync(bytes) : bytes

  let compact: CompactPayload
  try {
    compact = JSON.parse(unzipped.toString("utf8")) as CompactPayload
  } catch {
    throw new SignedLinkError("INVALID_TOKEN", "This action link could not be decoded.")
  }

  if (!compact || typeof compact.u !== "string") {
    throw new SignedLinkError("INVALID_TOKEN", "This action link is missing a destination.")
  }

  const expanded = expandPayload({
    u: compact.u,
    t: typeof compact.t === "string" ? compact.t : undefined,
    l: typeof compact.l === "string" ? compact.l : undefined,
    a: compact.a === "r" ? "r" : "c",
  })

  const validated = validatePayload(expanded)
  if (!validated.ok) {
    throw new SignedLinkError("INVALID_TOKEN", validated.error)
  }

  return validated.payload
}

export function encodeSignedToken(payload: ActionLinkPayload): string {
  const body = encodeBody(payload)
  return `${body}.${sign(body)}`
}

export function decodeSignedToken(token: string): ActionLinkPayload {
  const trimmed = token.trim()
  const separator = trimmed.lastIndexOf(".")
  if (separator <= 0 || separator === trimmed.length - 1) {
    throw new SignedLinkError("INVALID_TOKEN", "This action link is malformed.")
  }

  const body = trimmed.slice(0, separator)
  const signature = trimmed.slice(separator + 1)
  const expected = sign(body)

  if (!signaturesMatch(signature, expected)) {
    throw new SignedLinkError(
      "BAD_SIGNATURE",
      "This action link failed signature checks. It may have been edited, or this server uses a different signing secret."
    )
  }

  return decodeBody(body)
}

export function buildSelfContainedPath(payload: ActionLinkPayload): string {
  const token = encodeSignedToken(payload)
  if (token.length > MAX_SELF_CONTAINED_CHARS) {
    throw new PayloadTooLargeError(token.length)
  }
  return `/g?d=${token}`
}
