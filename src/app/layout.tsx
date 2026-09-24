import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Atmosphere } from "@/components/atmosphere"
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
      <body className={`${geistSans.className} min-h-full bg-background font-sans text-foreground`}>
        <div className="relative isolate min-h-full">
          <Atmosphere />
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  )
}
