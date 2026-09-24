import { Brand } from "@/components/brand"

export function SiteHeader() {
  return (
    <header className="flex h-12 items-center justify-between gap-4 border-b border-white/10 bg-black/15 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3">
        <Brand className="md:hidden" />
        <h1 className="font-heading text-sm font-medium tracking-tight">
          Create
        </h1>
      </div>
      <p className="text-xs tracking-tight text-muted-foreground">
        Copy, then go
      </p>
    </header>
  )
}
