import { ActionRuntime } from "@/components/action-runtime"
import { RuntimeError, RuntimeShell } from "@/components/runtime-states"
import { SignedLinkError } from "@/lib/signed-link"
import { getActionLinkFromToken } from "@/lib/store"
import type { ActionLinkPayload } from "@/lib/payload"

export default async function SignedGoPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string | string[] }>
}) {
  const params = await searchParams
  const raw = params.d
  const token = Array.isArray(raw) ? raw[0] : raw

  if (!token) {
    return (
      <RuntimeShell>
        <RuntimeError
          title="This link is missing its payload"
          description="Self-contained Go Action links look like /g?d=… If you have a short id instead, open /g/your-id."
        />
      </RuntimeShell>
    )
  }

  let payload: ActionLinkPayload | null = null
  let errorDescription: string | null = null
  try {
    payload = getActionLinkFromToken(token)
  } catch (error) {
    errorDescription =
      error instanceof SignedLinkError
        ? error.message
        : "This action link could not be opened."
  }

  if (errorDescription || !payload) {
    return (
      <RuntimeShell>
        <RuntimeError
          title="Invalid action link"
          description={errorDescription ?? "This action link could not be opened."}
        />
      </RuntimeShell>
    )
  }

  return (
    <RuntimeShell>
      <ActionRuntime payload={payload} />
    </RuntimeShell>
  )
}
