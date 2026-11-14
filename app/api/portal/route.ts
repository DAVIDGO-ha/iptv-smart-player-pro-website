import { NextResponse } from "next/server"
import { checkDevice, normId, sql } from "@/lib/db"

export const dynamic = "force-dynamic"

const attempts = new Map<string, { n: number; t: number }>()
function limited(ip: string) {
  const now = Date.now()
  const a = attempts.get(ip)
  if (!a || now - a.t > 10 * 60000) {
    attempts.set(ip, { n: 1, t: now })
    return false
  }
  a.n++
  return a.n > 30
}

// Website portal: { action: "list" | "add" | "update" | "delete", id, key, playlist?, playlistId? }
export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "x"
    const b = await req.json()
    const c = await checkDevice(b.id, b.key)
    if (!c.ok) {
      if (limited(ip)) return NextResponse.json({ ok: false, error: "Too many attempts. Please wait 10 minutes." }, { status: 429 })
      await new Promise((r) => setTimeout(r, 600))
      return NextResponse.json({ ok: false, error: c.error }, { status: 401 })
    }
    const id = normId(b.id)
    const q = sql()
    if (b.action === "add" || b.action === "update") {
      const p = b.playlist || {}
      const type = p.type === "m3u" ? "m3u" : "xtream"
      const name = String(p.name || "").slice(0, 60) || "My Playlist"
      const clean = (v: any) => (v ? String(v).trim().slice(0, 1000) : null)
      if (type === "xtream" && (!p.server || !p.username || !p.password)) return NextResponse.json({ ok: false, error: "Server URL, username and password are required." }, { status: 400 })
      if (type === "m3u" && !/^https?:\/\//i.test(p.url || "")) return NextResponse.json({ ok: false, error: "Enter a valid playlist link starting with http:// or https://" }, { status: 400 })
      if (b.action === "add") {
        const count = (await q`SELECT count(*)::int AS n FROM playlists WHERE device_id = ${id}`) as any[]
        if (count[0].n >= 10) return NextResponse.json({ ok: false, error: "Maximum 10 playlists per device." }, { status: 400 })
        const pid = crypto.randomUUID()
        await q`INSERT INTO playlists (id, device_id, name, type, server, username, password, url, epg_url)
                VALUES (${pid}, ${id}, ${name}, ${type}, ${clean(p.server)}, ${clean(p.username)}, ${clean(p.password)}, ${clean(p.url)}, ${clean(p.epgUrl)})`
      } else {
        await q`UPDATE playlists SET name = ${name}, type = ${type}, server = ${clean(p.server)}, username = ${clean(p.username)}, password = ${clean(p.password)},
                url = ${clean(p.url)}, epg_url = ${clean(p.epgUrl)}, updated_at = now() WHERE id = ${String(b.playlistId)} AND device_id = ${id}`
      }
    }
    if (b.action === "delete") await q`DELETE FROM playlists WHERE id = ${String(b.playlistId)} AND device_id = ${id}`
    const rows = (await q`SELECT id, name, type, server, username, url, epg_url, created_at FROM playlists WHERE device_id = ${id} ORDER BY created_at`) as any[]
    return NextResponse.json({
      ok: true,
      device: { id, platform: c.device.platform, lastSeen: c.device.last_seen },
      playlists: rows.map((r) => ({ id: r.id, name: r.name, type: r.type, server: r.server, username: r.username, url: r.url, epgUrl: r.epg_url })),
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
