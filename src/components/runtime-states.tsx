import Link from "next/link"
import { TriangleAlert } from "lucide-react"
import { Brand } from "@/components/brand"
import { GestureShell, Surface } from "@/components/app-shell"
import { Button } from "@/components/ui/button"

export function RuntimeError({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <Surface className="flex flex-col gap-4 p-5 sm:p-6">
      <div className="flex size-9 items-center justify-center rounded-full bg-destructive/15 text-destructive">
        <TriangleAlert className="size-4" strokeWidth={2} />
      </div>
      <div className="flex flex-col gap-1.5">
        <h1 className="font-heading text-xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <Button asChild size="lg" className="h-11 w-fit">
        <Link href="/">Create a new action link</Link>
      </Button>
    </Surface>
  )
}

export function RuntimeShell({ children }: { children: React.ReactNode }) {
  return (
    <GestureShell>
      <Brand />
      {children}
    </GestureShell>
  )
}
