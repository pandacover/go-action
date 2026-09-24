"use client"

import { useMemo, useState } from "react"
import {
  Check,
  Copy,
  Database,
  Link2,
  Loader2,
  Sparkles,
  TriangleAlert,
} from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  MAX_SELF_CONTAINED_CHARS,
  X_ARTICLES_URL,
  composeClipboardText,
  estimateSelfContainedLength,
  hostnameOf,
  parseDestinationUrl,
  type ActionType,
  type ClipboardMode,
} from "@/lib/payload"

type CreateFormProps = {
  hasDatabase: boolean
}

type CreatedLink = {
  id?: string
  url: string
  storage: "supabase" | "signed"
}

export function CreateForm({ hasDatabase }: CreateFormProps) {
  const [destination, setDestination] = useState("")
  const [label, setLabel] = useState("")
  const [actionType, setActionType] = useState<ActionType>("copy_then_redirect")
  const [clipboardMode, setClipboardMode] = useState<ClipboardMode>("split")
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [single, setSingle] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [created, setCreated] = useState<CreatedLink | null>(null)

  const clipboardText = useMemo(
    () =>
      actionType === "redirect_only"
        ? undefined
        : composeClipboardText({ mode: clipboardMode, title, body, single }),
    [actionType, clipboardMode, title, body, single]
  )

  const parsedDestination = parseDestinationUrl(destination)
  const estimatedLength = useMemo(
    () =>
      estimateSelfContainedLength({
        destination_url: parsedDestination.ok
          ? parsedDestination.url
          : destination.trim(),
        clipboard_text: clipboardText,
        label: label.trim() || undefined,
        action_type: actionType,
      }),
    [parsedDestination, destination, clipboardText, label, actionType]
  )

  const overLimit = !hasDatabase && estimatedLength > MAX_SELF_CONTAINED_CHARS
  const destinationHost = parsedDestination.ok
    ? hostnameOf(parsedDestination.url)
    : null

  function applyXArticlesPreset() {
    setDestination(X_ARTICLES_URL)
    if (!label.trim()) setLabel("X Articles")
    setActionType("copy_then_redirect")
    toast.success("Filled the X Articles destination")
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)
    setCopied(false)

    if (!parsedDestination.ok) {
      setFormError(parsedDestination.error)
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination_url: parsedDestination.url,
          clipboard_text: clipboardText,
          label: label.trim() || undefined,
          action_type: actionType,
        }),
      })

      const data = (await response.json()) as CreatedLink & {
        error?: string
        length?: number
        max?: number
      }

      if (!response.ok) {
        setCreated(null)
        setFormError(data.error ?? "Could not create the action link.")
        return
      }

      setCreated({
        id: data.id,
        url: data.url,
        storage: data.storage ?? (data.id ? "supabase" : "signed"),
      })
      toast.success("Action link ready")
    } catch {
      setFormError("Network error. Try again in a moment.")
    } finally {
      setSubmitting(false)
    }
  }

  async function copyShareUrl() {
    if (!created) return
    try {
      await navigator.clipboard.writeText(created.url)
      setCopied(true)
      toast.success("Shareable URL copied")
    } catch {
      toast.error("Could not copy. Select the URL instead.")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-0 bg-card/80 ring-1 ring-white/10 backdrop-blur">
        <CardHeader className="gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-lg">Build an action link</CardTitle>
            <Badge variant="outline">
              {hasDatabase ? (
                <>
                  <Database />
                  Supabase
                </>
              ) : (
                <>
                  <Link2 />
                  Self-contained
                </>
              )}
            </Badge>
          </div>
          <CardDescription>
            {hasDatabase
              ? "Links are stored in Supabase, so long articles get a short /g/id URL."
              : "No database is configured. The shareable URL carries a signed payload, so keep it short."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-6" onSubmit={onSubmit} autoComplete="off">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label htmlFor="destination">Destination URL</Label>
                <button
                  type="button"
                  onClick={applyXArticlesPreset}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  <Sparkles className="size-3" />
                  X Articles
                </button>
              </div>
              <Input
                id="destination"
                name="destination"
                type="text"
                inputMode="url"
                autoComplete="off"
                spellCheck={false}
                required
                placeholder="https://"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                onInput={(event) => setDestination(event.currentTarget.value)}
                aria-invalid={Boolean(destination) && !parsedDestination.ok}
              />
              <p className="text-xs text-muted-foreground">
                {destinationHost
                  ? `Opens ${destinationHost}`
                  : "Required. Example: https://x.com/compose/articles"}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                name="label"
                placeholder="X article draft"
                value={label}
                maxLength={120}
                onChange={(event) => setLabel(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Optional name shown on the intermediate page.
              </p>
            </div>

            <fieldset className="flex flex-col gap-3">
              <legend className="text-sm font-medium">Action type</legend>
              <RadioGroup
                value={actionType}
                onValueChange={(value) => setActionType(value as ActionType)}
                className="grid gap-2"
              >
                <ActionChoice
                  id="action-copy"
                  value="copy_then_redirect"
                  title="Copy, then redirect"
                  description="Write clipboard text with the click, then open the destination."
                />
                <ActionChoice
                  id="action-redirect"
                  value="redirect_only"
                  title="Redirect only"
                  description="Skip the clipboard. Still show an intermediate page, then continue."
                />
              </RadioGroup>
            </fieldset>

            {actionType === "copy_then_redirect" ? (
              <div className="flex flex-col gap-3">
                <Label>Clipboard text</Label>
                <Tabs
                  value={clipboardMode}
                  onValueChange={(value) =>
                    setClipboardMode(value as ClipboardMode)
                  }
                >
                  <TabsList>
                    <TabsTrigger value="split">Title + body</TabsTrigger>
                    <TabsTrigger value="single">One field</TabsTrigger>
                  </TabsList>
                  <TabsContent value="split" className="flex flex-col gap-3 pt-3">
                    <Input
                      id="title"
                      name="title"
                      placeholder="Article title"
                      value={title}
                      autoComplete="off"
                      onChange={(event) => setTitle(event.target.value)}
                      onInput={(event) => setTitle(event.currentTarget.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") event.preventDefault()
                      }}
                    />
                    <Textarea
                      id="body"
                      name="body"
                      placeholder="Article body, markdown or plain text"
                      value={body}
                      onChange={(event) => setBody(event.target.value)}
                      onInput={(event) => setBody(event.currentTarget.value)}
                      className="min-h-40"
                    />
                  </TabsContent>
                  <TabsContent value="single" className="pt-3">
                    <Textarea
                      id="single"
                      placeholder="Paste the full title and body as markdown or plain text"
                      value={single}
                      onChange={(event) => setSingle(event.target.value)}
                      className="min-h-48"
                    />
                  </TabsContent>
                </Tabs>
                <p className="text-xs text-muted-foreground">
                  {clipboardText
                    ? `${clipboardText.length.toLocaleString()} characters will be copied.`
                    : "Optional. If empty, the link still opens the destination."}
                </p>
              </div>
            ) : null}

            {!hasDatabase ? (
              <p
                className={
                  overLimit
                    ? "text-xs font-medium text-destructive"
                    : "text-xs text-muted-foreground"
                }
              >
                Estimated signed URL payload: {estimatedLength.toLocaleString()} /{" "}
                {MAX_SELF_CONTAINED_CHARS.toLocaleString()} characters
                {overLimit
                  ? " — too long for a self-contained link. Shorten the text or configure Supabase."
                  : "."}
              </p>
            ) : null}

            {overLimit ? (
              <Alert variant="destructive">
                <TriangleAlert />
                <AlertTitle>Database required for this payload</AlertTitle>
                <AlertDescription>
                  Self-contained links must stay under {MAX_SELF_CONTAINED_CHARS}{" "}
                  characters. Add{" "}
                  <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and a
                  Supabase key to store long articles as short /g/id links.
                </AlertDescription>
              </Alert>
            ) : null}

            {formError ? (
              <Alert variant="destructive">
                <TriangleAlert />
                <AlertTitle>Could not create the link</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            ) : null}

            <Button
              type="submit"
              size="lg"
              className="h-11 w-full sm:w-auto"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 data-icon="inline-start" className="animate-spin" />
              ) : (
                <Link2 data-icon="inline-start" />
              )}
              {submitting ? "Creating…" : "Create action link"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {created ? (
        <Card className="border-0 bg-primary/10 ring-1 ring-primary/25">
          <CardHeader>
            <CardTitle className="text-lg">Shareable URL</CardTitle>
            <CardDescription>
              {created.storage === "supabase"
                ? "Short database-backed link."
                : "Signed self-contained link. Anyone with the URL can run the action."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                readOnly
                value={created.url}
                className="font-mono text-xs sm:text-sm"
                onFocus={(event) => event.currentTarget.select()}
              />
              <Button type="button" className="h-8 sm:h-8" onClick={copyShareUrl}>
                {copied ? (
                  <Check data-icon="inline-start" />
                ) : (
                  <Copy data-icon="inline-start" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <a
              href={created.url}
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Open the intermediate page
            </a>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

function ActionChoice({
  id,
  value,
  title,
  description,
}: {
  id: string
  value: ActionType
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/80 bg-background/40 p-3 has-[[data-state=checked]]:border-primary/50 has-[[data-state=checked]]:bg-primary/8 has-[[data-checked]]:border-primary/50 has-[[data-checked]]:bg-primary/8">
      <RadioGroupItem value={value} id={id} className="mt-0.5" />
      <Label htmlFor={id} className="flex flex-col items-start gap-1 font-normal">
        <span className="font-medium text-foreground">{title}</span>
        <span className="text-sm leading-relaxed font-normal text-muted-foreground">
          {description}
        </span>
      </Label>
    </div>
  )
}
