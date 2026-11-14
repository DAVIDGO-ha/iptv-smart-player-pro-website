import { NextResponse } from "next/server"
import { promises as dns } from "dns"
import { cors, ensureSchema, normId, sql } from "@/lib/db"

export const dynamic = "force-dynamic"
export const OPTIONS = () => new NextResponse(null, { headers: cors })

// Called by the IPTV Smart Player PRO app when a playlist doesn't load (often an internet-provider DNS block in the UK / Germany).
// The server looks up the IPTV server's real address (outside the customer's provider), logs the failure for the admin,
// and sends the address back so the app can connect to it. No VPN — just the right address.
const isHost = (h: string) => /^[a-z0-9.-]{3,253}$/i.test(h) && h.includes(".") && !/^\d+\.\d+\.\d+\.\d+$/.test(h)

async function resolve(host: string): Promise<string[]> {
  try {
    const a = await dns.resolve4(host)
    if (a.length) return a
  } catch {}
  try {
    const r = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(host)}&type=A`, { headers: { accept: "application/dns-json" }, cache: "no-store" })
    const j = await r.json()
    return ((j?.Answer || []) as any[]).filter((x) => x.type === 1).map((x) => String(x.data))
  } catch {
    return []
  }
}

export async function POST(req: Request) {
  try {
    const b = await req.json().catch(() => ({}))
    const host = String(b.host || "").toLowerCase().trim()
    if (!isHost(host)) return NextResponse.json({ ok: false, error: "bad host" }, { status: 400, headers: cors })
    const ips = await resolve(host)
    if (b.report)
    try {
      await ensureSchema()
      const q = sql()
      await q`CREATE TABLE IF NOT EXISTS load_reports (id SERIAL PRIMARY KEY, device_id TEXT, host TEXT, error TEXT, ips TEXT, fixed BOOLEAN DEFAULT false, country TEXT, created_at TIMESTAMPTZ DEFAULT now())`
      await q`INSERT INTO load_reports (device_id, host, error, ips, fixed, country)
              VALUES (${b.id ? normId(b.id) : null}, ${host}, ${String(b.error || "").slice(0, 300) || null}, ${ips.join(",") || null}, ${!!b.fixed}, ${req.headers.get("x-vercel-ip-country")})`
    } catch {}
    return NextResponse.json({ ok: true, ips }, { headers: { ...cors, "Cache-Control": "no-store" } })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message, ips: [] }, { status: 500, headers: cors })
  }
}
