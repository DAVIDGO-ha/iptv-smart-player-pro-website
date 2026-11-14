import { NextResponse } from "next/server"
import { cors, ensureSchema, normId, normKey, sql } from "@/lib/db"

export const dynamic = "force-dynamic"
export const OPTIONS = () => new NextResponse(null, { headers: cors })

// Called by the app on start. First call creates the device; later calls refresh last_seen.
// If the key on the TV was reset, the stored key is replaced and old playlists are removed.
export async function POST(req: Request) {
  try {
    const b = await req.json()
    const id = normId(b.id)
    const key = normKey(b.key)
    if (!/^[0-9A-F]{2}(:[0-9A-F]{2}){5}$/.test(id) || key.length !== 6) return NextResponse.json({ ok: false, error: "bad device" }, { status: 400, headers: cors })
    await ensureSchema()
    const q = sql()
    const rows = (await q`SELECT device_key FROM devices WHERE device_id = ${id}`) as any[]
    if (!rows.length) await q`INSERT INTO devices (device_id, device_key, platform, app_version) VALUES (${id}, ${key}, ${b.platform || null}, ${b.version || null})`
    else {
      if (rows[0].device_key !== key) await q`DELETE FROM playlists WHERE device_id = ${id}`
      await q`UPDATE devices SET device_key = ${key}, platform = ${b.platform || null}, app_version = ${b.version || null}, last_seen = now() WHERE device_id = ${id}`
    }
    return NextResponse.json({ ok: true }, { headers: cors })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500, headers: cors })
  }
}
