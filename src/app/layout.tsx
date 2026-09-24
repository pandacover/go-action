import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Go Action",
    template: "%s · Go Action",
  },
  description:
    "Create a shareable link that copies text to the clipboard, then opens any destination URL.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <div className="relative isolate min-h-full overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_circle_at_10%_-10%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_55%),radial-gradient(900px_circle_at_100%_0%,color-mix(in_oklch,var(--primary)_10%,transparent),transparent_40%),linear-gradient(180deg,oklch(0.19_0.03_155),oklch(0.13_0.02_155))]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_35%,transparent_75%)]"
          />
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  )
}
