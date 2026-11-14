import { NextResponse } from "next/server"
import { FILES, RELEASE_URL } from "@/lib/site"

export const dynamic = "force-dynamic"

// /download/windows, /download/mac, /download/linux, /download/lg, /download/samsung, /download/web, /download/android
export async function GET(_: Request, { params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params
  const file = FILES[platform.toLowerCase()]
  if (!file) return NextResponse.redirect(new URL("/#download", _.url), 302)
  return NextResponse.redirect(`${RELEASE_URL}/${file}`, { status: 302, headers: { "Cache-Control": "no-store" } })
}
