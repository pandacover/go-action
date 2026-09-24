import { Brand } from "@/components/brand"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col gap-8 px-4 py-16">
      <Brand />
      <div className="flex flex-col gap-3">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="text-muted-foreground">
          That URL is not a Go Action page. Create a new link from the home
          page.
        </p>
        <Button asChild className="mt-2 w-fit">
          <Link href="/">Go to Go Action</Link>
        </Button>
      </div>
    </div>
  )
}
