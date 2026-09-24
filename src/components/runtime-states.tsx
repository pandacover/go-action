import Link from "next/link"
import { TriangleAlert } from "lucide-react"
import { Brand } from "@/components/brand"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function RuntimeError({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <Card className="border-0 bg-card/80 ring-1 ring-white/10">
      <CardHeader className="gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <TriangleAlert className="size-5" />
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild size="lg" className="h-11">
          <Link href="/">Create a new action link</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export function RuntimeShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8 px-4 py-8 sm:py-16">
      <Brand />
      {children}
    </div>
  )
}
