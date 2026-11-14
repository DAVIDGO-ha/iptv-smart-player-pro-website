import { neon } from "@neondatabase/serverless"

// Needs DATABASE_URL — connect the Neon integration in v0 and it is set automatically.
export function sql() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (!url) throw new Error("Database is not connected. Add the Neon integration (DATABASE_URL).")
  return neon(url)
}

let ready: Promise<void> | null = null
export function ensureSchema() {
  if (!ready)
    ready = (async () => {
      const q = sql()
      await q`CREATE TABLE IF NOT EXISTS devices (
        device_id TEXT PRIMARY KEY,
        device_key TEXT NOT NULL,
        platform TEXT,
        app_version TEXT,
        created_at TIMESTAMPTZ DEFAULT now(),
        last_seen TIMESTAMPTZ DEFAULT now()
      )`
      await q`CREATE TABLE IF NOT EXISTS playlists (
        id TEXT PRIMARY KEY,
        device_id TEXT NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        server TEXT,
        username TEXT,
        password TEXT,
        url TEXT,
        epg_url TEXT,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      )`
      await q`CREATE INDEX IF NOT EXISTS playlists_device_idx ON playlists(device_id)`
      await q`ALTER TABLE devices ADD COLUMN IF NOT EXISTS blocked BOOLEAN DEFAULT false`
      await q`ALTER TABLE devices ADD COLUMN IF NOT EXISTS note TEXT`
      await q`ALTER TABLE devices ADD COLUMN IF NOT EXISTS client_name TEXT`
      await q`ALTER TABLE devices ADD COLUMN IF NOT EXISTS sub_start DATE`
      await q`ALTER TABLE devices ADD COLUMN IF NOT EXISTS sub_end DATE`
      // 7-day free trial per device (devices that already existed get 7 days from the moment this was added)
      await q`ALTER TABLE devices ADD COLUMN IF NOT EXISTS trial_end TIMESTAMPTZ DEFAULT (now() + interval '7 days')`
    })().catch((e) => {
      ready = null
      throw e
    })
  return ready
}

// "4f9a217c0be3" / "4F-9A-21-7C-0B-E3" -> "4F:9A:21:7C:0B:E3"
export function normId(raw: string) {
  const hex = String(raw || "").toUpperCase().replace(/[^0-9A-F]/g, "")
  if (hex.length === 12) return hex.match(/.{2}/g)!.join(":")
  return String(raw || "").trim().toUpperCase()
}
export const normKey = (k: string) => String(k || "").replace(/\D/g, "").slice(0, 6)

export async function checkDevice(id: string, key: string) {
  await ensureSchema()
  const q = sql()
  const rows = (await q`SELECT device_id, device_key, platform, last_seen, blocked, trial_end, to_char(sub_end, 'YYYY-MM-DD') AS sub_end FROM devices WHERE device_id = ${normId(id)}`) as any[]
  if (!rows.length) return { ok: false as const, error: "Device not found. Open IPTV Smart Player PRO on your TV once (connected to the internet), then try again." }
  if (rows[0].device_key !== normKey(key)) return { ok: false as const, error: "Wrong Device Key. Check the key shown on your TV." }
  if (rows[0].blocked) return { ok: false as const, blocked: true, error: "This device is blocked. Please contact support." }
  return { ok: true as const, device: rows[0] }
}

// Licence sent to the app: free trial end, paid-until date ($5 / year) or lifetime ($15)
export const LIFETIME = "2099-12-31"
export const licenseOf = (r: { trial_end?: string | Date | null; sub_end?: string | null }) => ({
  trialEnd: r.trial_end ? new Date(r.trial_end).toISOString() : null,
  subEnd: r.sub_end || null,
  lifetime: !!r.sub_end && r.sub_end >= "2099-01-01",
})

export const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}
