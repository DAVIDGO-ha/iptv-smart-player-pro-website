import { NextResponse } from "next/server"
import { GITHUB_APK_URL } from "@/lib/site"

export const runtime = "edge"
export const dynamic = "force-dynamic"

// yoursite/download → downloads IPTV-Smart-Player-PRO.apk straight away from this site (also works in the Firestick Downloader app).
// The file is the latest APK built by GitHub Actions, streamed through this domain.
export async function GET() {
  try {
    const upstream = await fetch(GITHUB_APK_URL, { redirect: "follow", cache: "no-store" })
    if (!upstream.ok || !upstream.body) throw new Error(`APK fetch failed: ${upstream.status}`)
    const headers = new Headers({
      "Content-Type": "application/vnd.android.package-archive",
      "Content-Disposition": 'attachment; filename="IPTV-Smart-Player-PRO.apk"',
      "Cache-Control": "no-store",
    })
    const len = upstream.headers.get("content-length")
    if (len) headers.set("Content-Length", len)
    return new Response(upstream.body, { status: 200, headers })
  } catch {
    // Fallback: send the visitor directly to the GitHub file (still downloads automatically)
    return NextResponse.redirect(GITHUB_APK_URL, { status: 302, headers: { "Cache-Control": "no-store" } })
  }
}
