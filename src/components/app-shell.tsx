import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"

export function ComposerShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[42rem] flex-col px-4 py-5 sm:py-6">
      <SiteHeader />
      <main className="mt-6 flex flex-1 flex-col gap-5 pb-8">{children}</main>
    </div>
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
