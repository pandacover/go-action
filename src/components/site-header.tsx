import { Brand } from "@/components/brand"

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between gap-4">
      <Brand />
      <p className="hidden text-xs text-muted-foreground sm:block">
        Copy, then go.
      </p>
    </header>
  )
}
