import { ComposerShell } from "@/components/app-shell"
import { CreateForm } from "@/components/create-form"
import { isSupabaseConfigured } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export default function HomePage() {
  const hasDatabase = isSupabaseConfigured()

  return (
    <ComposerShell>
      <section className="flex flex-col gap-1.5">
        <h1 className="font-heading text-[1.75rem] leading-none font-semibold tracking-tight sm:text-3xl">
          Create an action link
        </h1>
        <p className="text-sm text-muted-foreground">
          Copies text, then opens a URL.
        </p>
      </section>
      <CreateForm hasDatabase={hasDatabase} />
    </ComposerShell>
  )
}
