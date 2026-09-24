import { CreateForm } from "@/components/create-form"
import { SiteHeader } from "@/components/site-header"
import { isSupabaseConfigured } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export default function HomePage() {
  const hasDatabase = isSupabaseConfigured()

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-4 py-8 sm:py-12">
      <SiteHeader />
      <section className="flex flex-col gap-4">
        <p className="w-fit rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium tracking-wide text-primary uppercase">
          Shareable action links
        </p>
        <h1 className="font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
          A link that copies, then goes.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
          Platforms often have no deeplink that prefills an action. X Articles
          cannot take a title or body via URL. Go Action lets you build a
          shareable link that copies the text, then opens any destination.
        </p>
      </section>
      <CreateForm hasDatabase={hasDatabase} />
      <HowItWorks />
    </div>
  )
}

function HowItWorks() {
  return (
    <section className="grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
      <Step
        n="1"
        title="Create"
        body="Point at a destination, optionally attach clipboard text, and get a URL."
      />
      <Step
        n="2"
        title="Share"
        body="Send the Go Action link. Recipients see a clear intermediate page, not a silent redirect."
      />
      <Step
        n="3"
        title="Paste"
        body="They click Copy & continue, land on the destination, and paste. X Articles is the first preset."
      />
    </section>
  )
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium tracking-widest text-primary uppercase">
        {n} — {title}
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  )
}
