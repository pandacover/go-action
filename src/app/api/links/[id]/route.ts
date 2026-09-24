import { NextResponse } from "next/server"
import { getActionLinkById, isSupabaseConfigured } from "@/lib/store"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params

  if (!id || !/^[A-Za-z0-9]+$/.test(id)) {
    return NextResponse.json({ error: "Invalid link id." }, { status: 400 })
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error:
          "Database storage is not configured. Self-contained links live at /g?d=…",
      },
      { status: 404 }
    )
  }

  try {
    const link = await getActionLinkById(id)
    if (!link) {
      return NextResponse.json({ error: "Action link not found." }, { status: 404 })
    }
    return NextResponse.json(link)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not load the action link."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
