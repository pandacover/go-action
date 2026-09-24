import { Brand } from "@/components/brand"
import { GestureShell, Surface } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <GestureShell>
      <Brand />
      <Surface className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Page not found
          </h1>
          <p className="text-sm text-muted-foreground">
            That URL is not a Go Action page.
          </p>
        </div>
        <Button asChild size="lg" className="h-11 w-fit">
          <Link href="/">Create a link</Link>
        </Button>
      </Surface>
    </GestureShell>
  )
}
