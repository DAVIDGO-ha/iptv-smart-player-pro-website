import { NextResponse } from "next/server"
import { checkDevice, cors, licenseOf, normId, sql } from "@/lib/db"

export const dynamic = "force-dynamic"
export const OPTIONS = () => new NextResponse(null, { headers: cors })

// Called by the app every few minutes: returns the playlists added on the website.
export async function GET(req: Request) {
  try {
    const u = new URL(req.url)
    const id = u.searchParams.get("id") || ""
    const key = u.searchParams.get("key") || ""
    const c = await checkDevice(id, key)
    // Blocked by the admin → the TV removes the website playlists on its next sync
    if (!c.ok && (c as any).blocked) return NextResponse.json({ ok: true, blocked: true, playlists: [] }, { headers: { ...cors, "Cache-Control": "no-store" } })
    if (!c.ok) return NextResponse.json({ ok: false, error: c.error, playlists: [] }, { status: 401, headers: cors })
    const q = sql()
    await q`UPDATE devices SET last_seen = now() WHERE device_id = ${normId(id)}`
    const rows = (await q`SELECT id, name, type, server, username, password, url, epg_url, updated_at FROM playlists WHERE device_id = ${normId(id)} ORDER BY created_at`) as any[]
    const playlists = rows.map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type,
      server: r.server || undefined,
      username: r.username || undefined,
      password: r.password || undefined,
      url: r.url || undefined,
      epgUrl: r.epg_url || undefined,
      updatedAt: r.updated_at,
    }))
    return NextResponse.json({ ok: true, playlists, license: licenseOf(c.device) }, { headers: { ...cors, "Cache-Control": "no-store" } })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message, playlists: [] }, { status: 500, headers: cors })
  }
}
