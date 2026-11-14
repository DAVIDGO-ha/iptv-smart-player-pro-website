import { cookies } from "next/headers"
import { randomBytes, scryptSync, timingSafeEqual, createHash } from "crypto"
import { ensureSchema, sql } from "@/lib/db"

export const COOKIE = "ipadm"

let ready: Promise<void> | null = null
export function ensureAdminSchema() {
  if (!ready)
    ready = (async () => {
      await ensureSchema()
      const q = sql()
      await q`CREATE TABLE IF NOT EXISTS admin_user (id INT PRIMARY KEY, pass_hash TEXT NOT NULL, salt TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now())`
      await q`CREATE TABLE IF NOT EXISTS admin_sessions (token_hash TEXT PRIMARY KEY, expires_at TIMESTAMPTZ NOT NULL)`
      await q`ALTER TABLE devices ADD COLUMN IF NOT EXISTS blocked BOOLEAN DEFAULT false`
      await q`ALTER TABLE devices ADD COLUMN IF NOT EXISTS note TEXT`
      await q`ALTER TABLE devices ADD COLUMN IF NOT EXISTS client_name TEXT`
      await q`ALTER TABLE devices ADD COLUMN IF NOT EXISTS sub_start DATE`
      await q`ALTER TABLE devices ADD COLUMN IF NOT EXISTS sub_end DATE`
      await q`ALTER TABLE devices ADD COLUMN IF NOT EXISTS trial_end TIMESTAMPTZ DEFAULT (now() + interval '7 days')`
    })().catch((e) => {
      ready = null
      throw e
    })
  return ready
}

const hashPass = (p: string, salt: string) => scryptSync(p, salt, 64).toString("hex")
const sha = (t: string) => createHash("sha256").update(t).digest("hex")

export async function hasAdmin() {
  await ensureAdminSchema()
  const r = (await sql()`SELECT 1 FROM admin_user WHERE id = 1`) as any[]
  return r.length > 0
}

export async function setPassword(p: string) {
  const salt = randomBytes(16).toString("hex")
  await sql()`INSERT INTO admin_user (id, pass_hash, salt) VALUES (1, ${hashPass(p, salt)}, ${salt})
              ON CONFLICT (id) DO UPDATE SET pass_hash = EXCLUDED.pass_hash, salt = EXCLUDED.salt`
}

export async function checkPassword(p: string) {
  const r = (await sql()`SELECT pass_hash, salt FROM admin_user WHERE id = 1`) as any[]
  if (!r.length) return false
  const a = Buffer.from(hashPass(p, r[0].salt), "hex")
  const b = Buffer.from(r[0].pass_hash, "hex")
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function newSession() {
  const token = randomBytes(32).toString("hex")
  await sql()`DELETE FROM admin_sessions WHERE expires_at < now()`
  await sql()`INSERT INTO admin_sessions (token_hash, expires_at) VALUES (${sha(token)}, now() + interval '30 days')`
  const c = await cookies()
  c.set(COOKIE, token, { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 30 * 86400 })
}

export async function isAdmin() {
  const c = await cookies()
  const t = c.get(COOKIE)?.value
  if (!t) return false
  await ensureAdminSchema()
  const r = (await sql()`SELECT 1 FROM admin_sessions WHERE token_hash = ${sha(t)} AND expires_at > now()`) as any[]
  return r.length > 0
}

export async function endSession(all = false) {
  const c = await cookies()
  const t = c.get(COOKIE)?.value
  if (all) await sql()`DELETE FROM admin_sessions`
  else if (t) await sql()`DELETE FROM admin_sessions WHERE token_hash = ${sha(t)}`
  c.delete(COOKIE)
}
