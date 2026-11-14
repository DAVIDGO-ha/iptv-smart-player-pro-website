"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { MonitorSmartphone, KeyRound, Server, User, Link2, Trash2, Pencil, LogOut, CheckCircle2, AlertCircle, Loader2, Tv, Lightbulb } from "lucide-react"

type PL = { id: string; name: string; type: "xtream" | "m3u"; server?: string; username?: string; url?: string; epgUrl?: string }
const empty = { name: "", type: "xtream" as "xtream" | "m3u", server: "", username: "", password: "", url: "", epgUrl: "" }

async function api(body: Record<string, unknown>) {
  const r = await fetch("/api/portal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
  const j = await r.json().catch(() => ({ ok: false, error: "Server error" }))
  if (!j.ok) throw new Error(j.error || "Something went wrong")
  return j
}

const input = "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-base outline-none transition placeholder:text-white/30 focus:border-red focus:ring-2 focus:ring-red/30"
const label = "grid gap-1.5 text-sm font-semibold text-white/60"

export function ActivatePortal() {
  const sp = useSearchParams()
  const [id, setId] = useState(sp.get("id") || "")
  const [key, setKey] = useState("")
  const [session, setSession] = useState<{ id: string; key: string } | null>(null)
  const [device, setDevice] = useState<{ platform?: string; lastSeen?: string } | null>(null)
  const [list, setList] = useState<PL[]>([])
  const [form, setForm] = useState({ ...empty })
  const [editing, setEditing] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState("")
  const [msg, setMsg] = useState("")

  useEffect(() => {
    try {
      const s = JSON.parse(sessionStorage.getItem("ipd") || "null")
      if (s && (!sp.get("id") || sp.get("id") === s.id)) login(s.id, s.key)
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function login(i = id, k = key) {
    setErr("")
    setBusy(true)
    try {
      const j = await api({ action: "list", id: i, key: k })
      setSession({ id: j.device.id, key: k })
      setDevice(j.device)
      setList(j.playlists)
      try {
        sessionStorage.setItem("ipd", JSON.stringify({ id: j.device.id, key: k }))
      } catch {}
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  // "http://host:port/get.php?username=..&password=.." -> Xtream fields
  function smart(url: string) {
    const m = url.trim().match(/^(https?:\/\/[^/]+)\/get\.php\?(.*)$/i)
    if (m) {
      const q = new URLSearchParams(m[2])
      if (q.get("username") && q.get("password")) {
        setForm((f) => ({ ...f, type: "xtream", server: m[1], username: q.get("username")!, password: q.get("password")!, url: "" }))
        setMsg("Xtream Codes details detected from your link ✓")
        return
      }
    }
    setForm((f) => ({ ...f, url }))
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!session) return
    setErr("")
    setMsg("")
    setBusy(true)
    try {
      const j = await api({ action: editing ? "update" : "add", ...session, playlistId: editing, playlist: form })
      setList(j.playlists)
      setForm({ ...empty })
      setEditing(null)
      setMsg("Saved ✓ Your playlist will appear on your TV in a few seconds.")
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  async function remove(p: PL) {
    if (!session || !confirm(`Remove “${p.name}” from your TV?`)) return
    setBusy(true)
    try {
      const j = await api({ action: "delete", ...session, playlistId: p.id })
      setList(j.playlists)
      setMsg("Playlist removed.")
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const alerts = (
    <>
      {err && (
        <p className="flex items-start gap-2 rounded-xl border border-red/40 bg-red/10 p-3 text-sm text-red-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red" /> {err}
        </p>
      )}
      {msg && (
        <p className="flex items-start gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-200">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /> {msg}
        </p>
      )}
    </>
  )

  if (!session)
    return (
      <form
        className="glass mx-auto grid max-w-xl gap-5 rounded-3xl p-6 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault()
          login()
        }}
      >
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-red glow-red">
          <MonitorSmartphone className="h-7 w-7" />
        </span>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-red">Activate your TV</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Add a playlist to your TV</h1>
          <p className="mt-2 text-white/65">
            Open IPTV Smart Player PRO on your TV and enter the <b className="text-white">MAC Address</b> and <b className="text-white">Device Key</b> shown on the screen.
          </p>
        </div>
        <label className={label}>
          MAC Address
          <input className={input + " font-mono text-lg uppercase tracking-widest"} value={id} onChange={(e) => setId(e.target.value)} placeholder="4F:9A:21:7C:0B:E3" autoCapitalize="characters" autoComplete="off" required />
        </label>
        <label className={label}>
          Device Key
          <input className={input + " font-mono text-lg tracking-[.3em]"} value={key} onChange={(e) => setKey(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="6 digits" inputMode="numeric" autoComplete="off" required />
        </label>
        {alerts}
        <button className="inline-flex items-center justify-center gap-2 rounded-full bg-red px-6 py-3.5 font-semibold glow-red transition hover:brightness-110 disabled:opacity-60" disabled={busy}>
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <KeyRound className="h-5 w-5" />} {busy ? "Checking…" : "Continue"}
        </button>
        <p className="text-xs text-white/45">IPTV Smart Player PRO is a media player and does not include any content. Add a playlist from your own provider.</p>
      </form>
    )

  return (
    <div className="grid gap-5">
      <section className="glass rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
              <Tv className="h-6 w-6 text-red" />
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.18em] text-red">Your device · MAC Address</p>
              <h1 className="font-mono text-2xl font-bold tracking-wider">{session.id}</h1>
              <p className="flex items-center gap-2 text-sm text-white/55">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {device?.platform || "TV"} · last online {device?.lastSeen ? new Date(device.lastSeen).toLocaleString() : "—"}
              </p>
            </div>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
            onClick={() => {
              sessionStorage.removeItem("ipd")
              setSession(null)
              setList([])
              setMsg("")
            }}
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
        <div className="mt-6 grid gap-3">
          {list.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 p-4">
              <span className={`rounded-md px-2 py-1 text-[11px] font-extrabold ${p.type === "xtream" ? "bg-cyan/15 text-cyan" : "bg-violet/15 text-violet"}`}>{p.type === "xtream" ? "XTREAM" : "M3U"}</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{p.name}</p>
                <p className="truncate text-sm text-white/50">{p.type === "xtream" ? `${p.server} · ${p.username}` : p.url}</p>
              </div>
              <button
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10"
                aria-label="Edit"
                onClick={() => {
                  setEditing(p.id)
                  setForm({ ...empty, name: p.name, type: p.type, server: p.server || "", username: p.username || "", url: p.url || "", epgUrl: p.epgUrl || "" })
                  setMsg("Editing — re-enter the password to save.")
                }}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button className="grid h-9 w-9 place-items-center rounded-full text-red hover:bg-red/10" aria-label="Delete" onClick={() => remove(p)}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {!list.length && <p className="text-white/55">No playlists yet — add your first one below.</p>}
        </div>
      </section>

      <form className="glass grid gap-4 rounded-3xl p-6 sm:p-8" onSubmit={save}>
        <p className="text-xs font-extrabold uppercase tracking-[.18em] text-red">{editing ? "Edit playlist" : "Add playlist"}</p>
        <div className="grid grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-black/30 p-1">
          {(["xtream", "m3u"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setForm({ ...form, type: t })} className={`rounded-xl py-2.5 text-sm font-bold transition ${form.type === t ? "bg-red text-white" : "text-white/60 hover:text-white"}`}>
              {t === "xtream" ? "Xtream Codes" : "M3U link"}
            </button>
          ))}
        </div>
        <label className={label}>
          Playlist name
          <input className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="My TV" maxLength={60} />
        </label>
        {form.type === "xtream" ? (
          <>
            <label className={label}>
              <span className="flex items-center gap-1.5"><Server className="h-4 w-4" /> Server URL</span>
              <input className={input} value={form.server} onChange={(e) => setForm({ ...form, server: e.target.value })} placeholder="http://example.com:8080" inputMode="url" autoCapitalize="off" required />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={label}>
                <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> Username</span>
                <input className={input} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} autoCapitalize="off" autoComplete="off" required />
              </label>
              <label className={label}>
                <span className="flex items-center gap-1.5"><KeyRound className="h-4 w-4" /> Password</span>
                <input className={input} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoCapitalize="off" autoComplete="off" required />
              </label>
            </div>
          </>
        ) : (
          <label className={label}>
            <span className="flex items-center gap-1.5"><Link2 className="h-4 w-4" /> M3U link</span>
            <input className={input} value={form.url} onChange={(e) => smart(e.target.value)} placeholder="http://provider.com/get.php?username=…&password=…&type=m3u_plus" inputMode="url" autoCapitalize="off" required />
          </label>
        )}
        <label className={label}>
          EPG link (optional)
          <input className={input} value={form.epgUrl} onChange={(e) => setForm({ ...form, epgUrl: e.target.value })} placeholder="Leave empty to use your provider's guide" inputMode="url" autoCapitalize="off" />
        </label>
        <p className="flex gap-2 rounded-2xl border border-gold/30 bg-gold/10 p-3 text-sm text-white/80">
          <Lightbulb className="h-5 w-5 shrink-0 text-gold" />
          <span>Paste a link with <code className="text-gold">get.php?username=</code> in the M3U tab — it fills in the Xtream details for you.</span>
        </p>
        {alerts}
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 rounded-full bg-red px-6 py-3 font-semibold glow-red transition hover:brightness-110 disabled:opacity-60" disabled={busy}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} {editing ? "Save changes" : "Send to my TV"}
          </button>
          {editing && (
            <button type="button" className="rounded-full border border-white/15 px-6 py-3 font-semibold hover:bg-white/10" onClick={() => { setEditing(null); setForm({ ...empty }); setMsg("") }}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
