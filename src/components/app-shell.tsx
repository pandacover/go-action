import Link from "next/link"
import { ArrowUpRight, ClipboardCopy, Database, Link2 } from "lucide-react"
import { Brand } from "@/components/brand"
import { SiteHeader } from "@/components/site-header"
import { cn } from "@/lib/utils"

/** Product chrome for create/home. /g stays on GestureShell — no sidebar there. */

export function ComposerShell({
  children,
  hasDatabase,
}: {
  children: React.ReactNode
  hasDatabase: boolean
}) {
  return (
    <div className="relative flex min-h-dvh">
      <AppSidebar hasDatabase={hasDatabase} />
      <div className="flex min-w-0 flex-1 flex-col">
        <SiteHeader />
        <main className="flex-1 overflow-auto">
          <div className="flex w-full max-w-3xl flex-col gap-5 px-5 py-5 sm:px-8 sm:py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function AppSidebar({ hasDatabase }: { hasDatabase: boolean }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-white/10 bg-black/25 backdrop-blur-2xl md:flex">
      <div className="flex h-12 items-center px-3">
        <Brand />
      </div>
      <nav className="flex flex-col gap-1 px-2 pt-3" aria-label="App">
        <Link
          href="/"
          aria-current="page"
          className="flex items-center gap-2 rounded-md bg-white/10 px-2.5 py-1.5 text-sm font-medium tracking-tight text-foreground"
        >
          <Link2 className="size-4" strokeWidth={2} />
          Create
        </Link>
      </nav>
      <div className="mt-6 px-3" aria-hidden>
        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 ring-1 ring-white/10">
          <ClipboardCopy className="size-3.5 text-muted-foreground" />
          <span className="text-[11px] font-medium tracking-tight text-muted-foreground">
            Copy
          </span>
          <span className="mx-auto text-[11px] text-white/30">→</span>
          <ArrowUpRight className="size-3.5 text-muted-foreground" />
          <span className="text-[11px] font-medium tracking-tight text-muted-foreground">
            Go
          </span>
        </div>
      </div>
      <div className="mt-auto border-t border-white/10 px-3 py-4">
        <p className="flex items-center gap-2 text-xs tracking-tight text-muted-foreground">
          {hasDatabase ? (
            <Database className="size-3.5" />
          ) : (
            <Link2 className="size-3.5" />
          )}
          {hasDatabase ? "Supabase" : "Self-contained"}
        </p>
      </div>
    </aside>
  )
}

export function GestureShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-[28rem] flex-col gap-5">{children}</div>
    </div>
  )
}

export function Surface({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn("glass rounded-2xl", className)}>{children}</div>
}
