import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/admin"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Playlist problems – IPTV Smart Player PRO", robots: { index: false, follow: false } }

// Playlists that failed to load in the app (usually an internet-provider block) and whether the app fixed it.
export default async function ReportsPage() {
  if (!(await isAdmin())) redirect("/admin")
  let rows: any[] = []
  try {
    rows = (await sql()`SELECT r.*, d.client_name FROM load_reports r LEFT JOIN devices d ON d.device_id = r.device_id ORDER BY r.created_at DESC LIMIT 200`) as any[]
  } catch {}
  return (
    <div className="bg-aurora min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-emerald-400">IPTV Smart Player PRO</p>
            <h1 className="text-2xl font-extrabold">Playlist problems</h1>
            <p className="text-sm text-white/55">Playlists that didn’t load on a client’s device. “Fixed” = the app switched to the server’s real address by itself.</p>
          </div>
          <Link href="/admin" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/10">← Dashboard</Link>
        </div>
        <div className="glass overflow-x-auto rounded-3xl p-4">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-white/45">
              <tr>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">MAC Address</th>
                <th className="px-3 py-2">Client</th>
                <th className="px-3 py-2">Country</th>
                <th className="px-3 py-2">Server</th>
                <th className="px-3 py-2">Result</th>
                <th className="px-3 py-2">Error</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-white/5">
                  <td className="whitespace-nowrap px-3 py-2 text-white/70">{new Date(r.created_at).toLocaleString("en-GB")}</td>
                  <td className="px-3 py-2 font-mono">{r.device_id || "—"}</td>
                  <td className="px-3 py-2">{r.client_name || ""}</td>
                  <td className="px-3 py-2">{r.country || ""}</td>
                  <td className="px-3 py-2 font-mono text-white/80">{r.host}</td>
                  <td className="px-3 py-2">
                    {r.fixed ? (
                      <span className="rounded-md bg-emerald-400/15 px-2 py-0.5 text-xs font-bold text-emerald-300">FIXED</span>
                    ) : (
                      <span className="rounded-md bg-red/20 px-2 py-0.5 text-xs font-bold text-red">FAILED</span>
                    )}
                  </td>
                  <td className="max-w-[260px] truncate px-3 py-2 text-white/55" title={r.error || ""}>{r.error || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && <p className="p-6 text-center text-white/55">No problems reported yet.</p>}
        </div>
      </div>
    </div>
  )
}
