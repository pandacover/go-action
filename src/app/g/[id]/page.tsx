import { ActionRuntime } from "@/components/action-runtime"
import { RuntimeError, RuntimeShell } from "@/components/runtime-states"
import { getActionLinkById, isSupabaseConfigured } from "@/lib/store"
import type { ActionLink } from "@/lib/payload"

export default async function GoIdPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (!isSupabaseConfigured()) {
    return (
      <RuntimeShell>
        <RuntimeError
          title="No database is configured"
          description="Short /g/id links need Supabase. Self-contained links use /g?d=… instead."
        />
      </RuntimeShell>
    )
  }

  if (!/^[A-Za-z0-9]+$/.test(id)) {
    return (
      <RuntimeShell>
        <RuntimeError
          title="Unknown action link"
          description="That id does not look like a Go Action short link."
        />
      </RuntimeShell>
    )
  }

  let link: ActionLink | null = null
  let loadError: string | null = null
  try {
    link = await getActionLinkById(id)
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "The action link could not be loaded."
  }

  if (loadError) {
    return (
      <RuntimeShell>
        <RuntimeError title="Could not load this link" description={loadError} />
      </RuntimeShell>
    )
  }

  if (!link) {
    return (
      <RuntimeShell>
        <RuntimeError
          title="Action link not found"
          description="This short link does not exist, or it was created on a different database."
        />
      </RuntimeShell>
    )
  }

  return (
    <RuntimeShell>
      <ActionRuntime payload={link} />
    </RuntimeShell>
  )
}
