import { ComposerShell } from "@/components/app-shell"
import { CreateForm } from "@/components/create-form"
import { isSupabaseConfigured } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export default function HomePage() {
  const hasDatabase = isSupabaseConfigured()

  return (
    <ComposerShell hasDatabase={hasDatabase}>
      <CreateForm hasDatabase={hasDatabase} />
    </ComposerShell>
  )
}
