import { Brand } from "@/components/brand"

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between gap-4">
      <Brand />
      <p className="text-xs tracking-tight text-muted-foreground">
        Copy, then go
      </p>
    </header>
  )
}
