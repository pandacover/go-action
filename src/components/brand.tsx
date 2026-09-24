import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function Brand({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 text-foreground no-underline",
        className
      )}
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <ArrowUpRight className="size-4" strokeWidth={2.25} />
      </span>
      <span className="font-heading text-[15px] font-semibold tracking-tight">
        Go Action
      </span>
    </Link>
  )
}
