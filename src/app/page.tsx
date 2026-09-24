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
      <HowItWorks />
    </ComposerShell>
  )
}

function HowItWorks() {
  return (
    <ol className="grid grid-cols-3 gap-2">
      <Step n="1" title="Create" />
      <Step n="2" title="Share" />
      <Step n="3" title="Paste" />
    </ol>
  )
}

function Step({ n, title }: { n: string; title: string }) {
  return (
    <li className="glass flex items-center gap-2 rounded-xl px-3 py-2.5">
      <span className="font-mono text-[11px] text-primary/80">{n}</span>
      <span className="text-sm font-medium tracking-tight">{title}</span>
    </li>
  )
}
