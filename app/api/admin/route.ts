import { NextResponse } from "next/server"
import { normId, sql } from "@/lib/db"
import { checkPassword, endSession, ensureAdminSchema, hasAdmin, isAdmin, newSession, setPassword } from "@/lib/admin"

export const dynamic = "force-dynamic"

const fails = new Map<string, { n: number; t: number }>()
const tooMany = (ip: string) => {
  const f = fails.get(ip)
  return !!f && Date.now() - f.t < 15 * 60000 && f.n >= 8
}
const fail = (ip: string) => {
  const f = fails.get(ip)
  if (!f || Date.now() - f.t > 15 * 60000) fails.set(ip, { n: 1, t: Date.now() })
  else f.n++
}
const ok = (d: Record<string, unknown> = {}) => NextResponse.json({ ok: true, ...d }, { headers: { "Cache-Control": "no-store" } })
const bad = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status })

// Admin API: { action, ... }. Everything except status/setup/login needs the admin cookie.
export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "x"
    const b = await req.json().catch(() => ({}))
    await ensureAdminSchema()
    const q = sql()

    if (b.action === "status") return ok({ setup: await hasAdmin(), loggedIn: await isAdmin() })
    if (b.action === "setup") {
      if (await hasAdmin()) return bad("Admin already created. Please log in.", 403)
      if (String(b.password || "").length < 8) return bad("Use at least 8 characters.")
      await setPassword(String(b.password))
      await newSession()
      return ok()
    }
    if (b.action === "login") {
      if (tooMany(ip)) return bad("Too many attempts. Wait 15 minutes.", 429)
      if (!(await checkPassword(String(b.password || "")))) {
        fail(ip)
        await new Promise((r) => setTimeout(r, 700))
        return bad("Wrong password.", 401)
      }
      await newSession()
      return ok()
    }
    if (!(await isAdmin())) return bad("Please log in.", 401)

    switch (b.action) {
      case "logout":
        await endSession()
        return ok()
      case "password": {
        if (!(await checkPassword(String(b.current || "")))) return bad("Current password is wrong.", 401)
        if (String(b.password || "").length < 8) return bad("Use at least 8 characters.")
        await setPassword(String(b.password))
        await endSession(true)
        await newSession()
        return ok()
      }
      case "stats": {
        const [s] = (await q`SELECT
            count(*)::int AS devices,
            count(*) FILTER (WHERE last_seen > now() - interval '1 day')::int AS today,
            count(*) FILTER (WHERE last_seen > now() - interval '7 days')::int AS week,
            count(*) FILTER (WHERE created_at > now() - interval '7 days')::int AS new_week,
            count(*) FILTER (WHERE blocked)::int AS blocked,
            count(*) FILTER (WHERE sub_end IS NOT NULL OR client_name IS NOT NULL)::int AS clients,
            count(*) FILTER (WHERE sub_end >= current_date AND sub_end < current_date + 30)::int AS expiring,
            count(*) FILTER (WHERE sub_end < current_date)::int AS expired,
            count(*) FILTER (WHERE (sub_end IS NULL OR sub_end < current_date) AND trial_end > now())::int AS trial,
            count(*) FILTER (WHERE (sub_end IS NULL OR sub_end < current_date) AND trial_end <= now())::int AS locked,
            count(*) FILTER (WHERE sub_end >= '2099-01-01')::int AS lifetime,
            count(*) FILTER (WHERE sub_end >= current_date AND sub_end < '2099-01-01')::int AS yearly
          FROM devices`) as any[]
        const [p] = (await q`SELECT count(*)::int AS playlists FROM playlists`) as any[]
        const plat = (await q`SELECT coalesce(platform, 'Unknown') AS platform, count(*)::int AS n FROM devices GROUP BY 1 ORDER BY 2 DESC`) as any[]
        return ok({ stats: { ...s, playlists: p.playlists }, platforms: plat })
      }
      case "devices": {
        const term = String(b.q || "").trim()
        const like = "%" + term.toUpperCase().replace(/[^0-9A-Z:]/g, "") + "%"
        const likeRaw = "%" + term + "%"
        const rows = (await q`SELECT d.device_id, d.device_key, d.platform, d.app_version, d.created_at, d.last_seen, d.blocked, d.note, d.client_name, to_char(d.sub_start, 'YYYY-MM-DD') AS sub_start, to_char(d.sub_end, 'YYYY-MM-DD') AS sub_end, d.trial_end,
              (SELECT count(*)::int FROM playlists p WHERE p.device_id = d.device_id) AS playlists
            FROM devices d
            WHERE ${term} = '' OR d.device_id LIKE ${like} OR replace(d.device_id, ':', '') LIKE ${like} OR d.note ILIKE ${likeRaw} OR d.client_name ILIKE ${likeRaw}
              OR EXISTS (SELECT 1 FROM playlists p WHERE p.device_id = d.device_id AND (p.username ILIKE ${likeRaw} OR p.name ILIKE ${likeRaw}))
            ORDER BY d.last_seen DESC NULLS LAST LIMIT 300`) as any[]
        return ok({ devices: rows })
      }
      case "device": {
        const id = normId(b.id)
        const [d] = (await q`SELECT device_id, device_key, platform, app_version, created_at, last_seen, blocked, note, client_name, to_char(sub_start, 'YYYY-MM-DD') AS sub_start, to_char(sub_end, 'YYYY-MM-DD') AS sub_end, trial_end FROM devices WHERE device_id = ${id}`) as any[]
        if (!d) return bad("Device not found.", 404)
        const pl = (await q`SELECT id, name, type, server, username, password, url, epg_url, created_at FROM playlists WHERE device_id = ${id} ORDER BY created_at`) as any[]
        return ok({ device: d, playlists: pl })
      }
      case "block":
        await q`UPDATE devices SET blocked = ${!!b.blocked} WHERE device_id = ${normId(b.id)}`
        return ok()
      case "note":
        await q`UPDATE devices SET note = ${String(b.note || "").slice(0, 200) || null} WHERE device_id = ${normId(b.id)}`
        return ok()
      case "client": {
        // Subscriber: client name + subscription from start date for N months (max 5 years), or lifetime
        const name = String(b.client || "").trim().slice(0, 80) || null
        const months = Math.max(0, Math.min(60, Math.round(Number(b.months) || 0)))
        const start = /^\d{4}-\d{2}-\d{2}$/.test(String(b.start || "")) ? String(b.start) : null
        const end = /^\d{4}-\d{2}-\d{2}$/.test(String(b.end || "")) ? String(b.end) : null
        if (b.clear) await q`UPDATE devices SET client_name = NULL, sub_start = NULL, sub_end = NULL WHERE device_id = ${normId(b.id)}`
        else if (b.lifetime) await q`UPDATE devices SET client_name = coalesce(${name}, client_name), sub_start = coalesce(${start}::date, current_date), sub_end = '2099-12-31' WHERE device_id = ${normId(b.id)}`
        else if (b.quick && months)
          // +1 year from today, or from the current end date if still active
          await q`UPDATE devices SET client_name = coalesce(${name}, client_name), sub_start = coalesce(sub_start, current_date),
                  sub_end = (greatest(coalesce(sub_end, current_date), current_date) + make_interval(months => ${months}::int))::date WHERE device_id = ${normId(b.id)}`
        else if (months && start)
          await q`UPDATE devices SET client_name = ${name}, sub_start = ${start}::date, sub_end = (${start}::date + make_interval(months => ${months}::int))::date WHERE device_id = ${normId(b.id)}`
        else await q`UPDATE devices SET client_name = ${name}, sub_start = coalesce(${start}::date, sub_start), sub_end = coalesce(${end}::date, sub_end) WHERE device_id = ${normId(b.id)}`
        return ok()
      }
      case "trial":
        // give a device a fresh free trial of N days
        await q`UPDATE devices SET trial_end = now() + make_interval(days => ${Math.max(1, Math.min(60, Number(b.days) || 7))}::int) WHERE device_id = ${normId(b.id)}`
        return ok()
      case "deleteDevice":
        await q`DELETE FROM devices WHERE device_id = ${normId(b.id)}`
        return ok()
      case "savePlaylist": {
        const id = normId(b.id)
        const p = b.playlist || {}
        const type = p.type === "m3u" ? "m3u" : "xtream"
        const clean = (v: any) => (v ? String(v).trim().slice(0, 1000) : null)
        const name = String(p.name || "").slice(0, 60) || "My Playlist"
        if (type === "xtream" && (!p.server || !p.username || !p.password)) return bad("Server, username and password are required.")
        if (type === "m3u" && !/^https?:\/\//i.test(p.url || "")) return bad("Enter a valid link starting with http:// or https://")
        if (p.id)
          await q`UPDATE playlists SET name = ${name}, type = ${type}, server = ${clean(p.server)}, username = ${clean(p.username)}, password = ${clean(p.password)},
                  url = ${clean(p.url)}, epg_url = ${clean(p.epgUrl)}, updated_at = now() WHERE id = ${String(p.id)} AND device_id = ${id}`
        else
          await q`INSERT INTO playlists (id, device_id, name, type, server, username, password, url, epg_url)
                  VALUES (${crypto.randomUUID()}, ${id}, ${name}, ${type}, ${clean(p.server)}, ${clean(p.username)}, ${clean(p.password)}, ${clean(p.url)}, ${clean(p.epgUrl)})`
        return ok()
      }
      case "deletePlaylist":
        await q`DELETE FROM playlists WHERE id = ${String(b.playlistId)} AND device_id = ${normId(b.id)}`
        return ok()
    }
    return bad("Unknown action")
  } catch (e: any) {
    return bad(e.message, 500)
  }
}
