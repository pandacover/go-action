"use client"

import { useMemo, useRef, useState } from "react"
import {
  AlertTriangle,
  Check,
  ClipboardCopy,
  Copy,
  ExternalLink,
  Info,
} from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  hostnameOf,
  truncatePreview,
  type ActionLinkPayload,
} from "@/lib/payload"

export function ActionRuntime({ payload }: { payload: ActionLinkPayload }) {
  const [fallback, setFallback] = useState(false)
  const [busy, setBusy] = useState(false)
  const [copiedFallback, setCopiedFallback] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const hostname = hostnameOf(payload.destination_url)
  const clipboardText = payload.clipboard_text ?? ""
  const shouldCopy =
    payload.action_type === "copy_then_redirect" && clipboardText.length > 0
  const preview = useMemo(
    () => (clipboardText ? truncatePreview(clipboardText) : ""),
    [clipboardText]
  )

  async function copyText(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }

  async function onPrimary() {
    setBusy(true)
    if (shouldCopy) {
      const ok = await copyText(clipboardText)
      if (!ok) {
        setFallback(true)
        setBusy(false)
        return
      }
    }
    window.location.assign(payload.destination_url)
  }

  async function onCopyFallback() {
    const ok = await copyText(clipboardText)
    if (ok) {
      setCopiedFallback(true)
      toast.success("Copied to clipboard")
      return
    }

    const node = textareaRef.current
    if (node) {
      node.focus()
      node.select()
      try {
        const selected = document.execCommand("copy")
        if (selected) {
          setCopiedFallback(true)
          toast.success("Copied to clipboard")
          return
        }
      } catch {
        /* stay on selectable fallback */
      }
    }
    toast.error("Select the text and copy it manually")
  }

  function onOpenDestination() {
    window.location.assign(payload.destination_url)
  }

  return (
    <Card className="border-0 bg-card/80 ring-1 ring-white/10 backdrop-blur">
      <CardHeader className="gap-3">
        <p className="text-xs font-medium tracking-widest text-primary uppercase">
          Ready to go
        </p>
        <CardTitle className="font-heading text-2xl leading-tight text-balance">
          {payload.label || `Continue to ${hostname}`}
        </CardTitle>
        <CardDescription className="text-base">
          This link opens{" "}
          <span className="font-medium text-foreground">{hostname}</span>
          {shouldCopy
            ? " after copying the text below to your clipboard."
            : "."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {shouldCopy ? (
          <div className="rounded-xl bg-muted/60 px-3.5 py-3 ring-1 ring-white/8">
            <p className="mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Clipboard preview
            </p>
            <p className="font-mono text-sm leading-relaxed text-foreground/90">
              {preview}
            </p>
            {clipboardText.length > preview.length ? (
              <p className="mt-2 text-xs text-muted-foreground">
                {clipboardText.length.toLocaleString()} characters total
              </p>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nothing will be copied. You will go straight to the destination.
          </p>
        )}

        <Alert className="border-primary/20 bg-primary/8">
          <Info className="size-4 text-primary" />
          <AlertTitle>Why this extra click?</AlertTitle>
          <AlertDescription>
            Browsers block clipboard writes unless they happen in the same
            moment as a user gesture. Go Action waits for your click, copies,
            then sends you onward. There is no silent redirect.
          </AlertDescription>
        </Alert>

        {fallback ? (
          <div className="flex flex-col gap-3">
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertTitle>Clipboard was blocked</AlertTitle>
              <AlertDescription>
                Copy the full text below, then open the destination. Some
                browsers require a permission prompt or a secure (https)
                context.
              </AlertDescription>
            </Alert>
            <textarea
              ref={textareaRef}
              readOnly
              value={clipboardText}
              className="min-h-40 w-full rounded-xl border border-input bg-input/40 p-3 font-mono text-sm outline-none selection:bg-primary/30"
              onFocus={(event) => event.currentTarget.select()}
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                size="lg"
                className="h-11 flex-1"
                onClick={onCopyFallback}
              >
                {copiedFallback ? (
                  <Check data-icon="inline-start" />
                ) : (
                  <Copy data-icon="inline-start" />
                )}
                {copiedFallback ? "Copied" : "Copy text"}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="h-11 flex-1"
                onClick={onOpenDestination}
              >
                <ExternalLink data-icon="inline-start" />
                Open destination
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            size="lg"
            className="h-12 w-full text-base"
            onClick={onPrimary}
            disabled={busy}
          >
            {shouldCopy ? (
              <ClipboardCopy data-icon="inline-start" />
            ) : (
              <ExternalLink data-icon="inline-start" />
            )}
            {busy
              ? "Opening…"
              : shouldCopy
                ? "Copy & continue"
                : "Continue"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
