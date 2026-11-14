"use client"
import { useEffect, useState } from "react"
import { Activity, Ban, CalendarClock, CheckCircle2, Clock, Crown, Infinity as InfinityIcon, Lock, KeyRound, ListVideo, Loader2, LogOut, MonitorSmartphone, Pencil, Plus, RefreshCw, Search, ShieldCheck, Trash2, Tv, UserPlus, X } from "lucide-react"

type Device = { device_id: string; device_key: string; platform?: string; app_version?: string; created_at: string; last_seen?: string; blocked?: boolean; note?: string; playlists?: number; client_name?: string; sub_start?: string; sub_end?: string; trial_end?: string }
type PL = { id?: string; name: string; type: "xtream" | "m3u"; server?: string; username?: string; password?: string; url?: string; epg_url?: string; epgUrl?: string }

async function api(body: Record<string, unknown>) {
  const r = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
  const j = await r.json().catch(() => ({ ok: false, error: "Server error" }))
  if (!j.ok) throw Object.assign(new Error(j.error || "Error"), { status: r.status })
  return j
}

const input = "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm outline-none placeholder:text-white/30 focus:border-red focus:ring-2 focus:ring-red/30"
const btn = "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-50"
const ago = (d?: string) => {
  if (!d) return "—"
  const s = (Date.now() - new Date(d).getTime()) / 1000
  if (s < 90) return "online now"
  if (s < 3600) return Math.round(s / 60) + " min ago"
  if (s < 86400) return Math.round(s / 3600) + " h ago"
  return Math.round(s / 86400) + " days ago"
}
// Subscription: days left until the expiry date
const daysLeft = (end?: string) => (end ? Math.ceil((new Date(end + "T23:59:59").getTime() - Date.now()) / 86400000) : null)
const fmtDate = (d?: string) => (d ? new Date(d + "T12:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "")
// App licence: 7-day free trial, then $5 / year or $15 lifetime
const isLifetime = (d: Device) => !!d.sub_end && d.sub_end >= "2099-01-01"
const license = (d: Device) => {
  if (isLifetime(d)) return { t: "LIFETIME · $15", c: "bg-emerald-400/15 text-emerald-300" }
  const n = daysLeft(d.sub_end)
  if (n !== null && n >= 0) return { t: "PAID · " + n + " days left", c: "bg-emerald-400/15 text-emerald-300" }
  const tl = d.trial_end ? Math.ceil((new Date(d.trial_end).getTime() - Date.now()) / 86400000) : 0
  if (tl > 0) return { t: "FREE TRIAL · " + tl + (tl === 1 ? " day" : " days") + " left", c: "bg-cyan/15 text-cyan" }
  return { t: d.sub_end ? "LOCKED · subscription expired" : "LOCKED · trial ended", c: "bg-red/20 text-red" }
}
const PLANS: [string, number][] = [["1 month", 1], ["3 months", 3], ["6 months", 6], ["1 year · $5", 12], ["2 years", 24], ["3 years", 36], ["4 years", 48], ["5 years", 60]]
const today = () => new Date().toISOString().slice(0, 10)
const addMonths = (start: string, m: number) => {
  const d = new Date(start + "T12:00:00")
  d.setMonth(d.getMonth() + m)
  return d.toISOString().slice(0, 10)
}

const online = (d?: string) => !!d && Date.now() - new Date(d).getTime() < 15 * 60000

export function AdminDashboard() {
  const [state, setState] = useState<"loading" | "setup" | "login" | "in">("loading")
  const [err, setErr] = useState("")
  useEffect(() => {
    api({ action: "status" })
      .then((j) => setState(j.loggedIn ? "in" : j.setup ? "login" : "setup"))
      .catch((e) => (setErr(e.message), setState("login")))
  }, [])
  if (state === "loading") return <div className="grid min-h-screen place-items-center"><Loader2 className="h-8 w-8 animate-spin text-red" /></div>
  if (state !== "in") return <Login setup={state === "setup"} initialErr={err} onDone={() => setState("in")} />
  return <Dashboard onLogout={() => setState("login")} />
}

function Login({ setup, initialErr, onDone }: { setup: boolean; initialErr: string; onDone: () => void }) {
  const [pw, setPw] = useState("")
  const [pw2, setPw2] = useState("")
  const [err, setErr] = useState(initialErr)
  const [busy, setBusy] = useState(false)
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <form
        className="glass grid w-full max-w-sm gap-4 rounded-3xl p-7"
        onSubmit={async (e) => {
          e.preventDefault()
          setErr("")
          if (setup && pw !== pw2) return setErr("Passwords don't match.")
          setBusy(true)
          try {
            await api({ action: setup ? "setup" : "login", password: pw })
            onDone()
          } catch (e) {
            setErr((e as Error).message)
          } finally {
            setBusy(false)
          }
        }}
      >
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500 shadow-[0_0_0_1px_rgba(16,185,129,.4),0_10px_40px_-8px_rgba(16,185,129,.65)]"><ShieldCheck className="h-6 w-6" /></span>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-emerald-400">IPTV Smart Player PRO</p>
          <h1 className="mt-1 text-2xl font-extrabold">{setup ? "Create admin password" : "Admin login"}</h1>
          {setup && <p className="mt-1 text-sm text-white/60">This is the first visit. Choose the password for your admin dashboard.</p>}
        </div>
        <input className={input} type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus required />
        {setup && <input className={input} type="password" placeholder="Repeat password" value={pw2} onChange={(e) => setPw2(e.target.value)} required />}
        {err && <p className="rounded-xl border border-red/40 bg-red/10 p-3 text-sm text-red-200">{err}</p>}
        <button className={btn + " bg-red py-3 glow-red"} disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} {setup ? "Create & enter" : "Log in"}
        </button>
      </form>
    </div>
  )
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [stats, setStats] = useState<any>(null)
  const [plats, setPlats] = useState<{ platform: string; n: number }[]>([])
  const [devices, setDevices] = useState<Device[]>([])
  const [q, setQ] = useState("")
  const [busy, setBusy] = useState(false)
  const [open, setOpen] = useState<string | null>(null)
  const [msg, setMsg] = useState("")

  const load = async (term = q) => {
    setBusy(true)
    try {
      const [s, d] = await Promise.all([api({ action: "stats" }), api({ action: "devices", q: term })])
      setStats(s.stats)
      setPlats(s.platforms)
      setDevices(d.devices)
    } catch (e: any) {
      if (e.status === 401) onLogout()
      else setMsg(e.message)
    } finally {
      setBusy(false)
    }
  }
  // Activate $5 / year or $15 lifetime straight from the table
  const activate = async (d: Device, lifetime: boolean) => {
    if (!confirm(lifetime ? `Activate LIFETIME ($15) for ${d.device_id}?` : `Activate 1 YEAR ($5) for ${d.device_id}?`)) return
    try {
      await api(lifetime ? { action: "client", id: d.device_id, lifetime: true } : { action: "client", id: d.device_id, quick: true, months: 12 })
      await load()
    } catch (e) {
      setMsg((e as Error).message)
    }
  }
  // Block / Unblock / Delete straight from the table
  const quick = async (action: "block" | "deleteDevice", d: Device, blocked?: boolean) => {
    const sure =
      action === "deleteDevice"
        ? confirm(`Delete ${d.device_id} and all its playlists?`)
        : blocked
          ? confirm(`Block ${d.device_id}? Its website playlists disappear from the TV.`)
          : true
    if (!sure) return
    try {
      await api({ action, id: d.device_id, blocked })
      await load()
    } catch (e) {
      setMsg((e as Error).message)
    }
  }

  useEffect(() => {
    load("")
    const t = setInterval(() => load(), 60000)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cards = stats
    ? [
        { l: "Devices", v: stats.devices, i: Tv, c: "text-red" },
        { l: "Active today", v: stats.today, i: Activity, c: "text-emerald-400" },
        { l: "New this week", v: stats.new_week, i: UserPlus, c: "text-gold" },
        { l: "On free trial", v: stats.trial ?? 0, i: Clock, c: "text-cyan" },
        { l: "Locked (not paid)", v: stats.locked ?? 0, i: Lock, c: "text-red" },
        { l: "Paid · 1 year ($5)", v: stats.yearly ?? 0, i: Crown, c: "text-emerald-400" },
        { l: "Paid · lifetime ($15)", v: stats.lifetime ?? 0, i: InfinityIcon, c: "text-emerald-400" },
        { l: "Expiring in 30 days", v: (stats.expiring ?? 0) + (stats.expired ? ` · ${stats.expired} expired` : ""), i: CalendarClock, c: "text-gold" },
        { l: "Playlists", v: stats.playlists, i: ListVideo, c: "text-violet" },
        { l: "Blocked", v: stats.blocked, i: Ban, c: "text-white/60" },
      ]
    : []

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-500 shadow-[0_0_0_1px_rgba(16,185,129,.4),0_10px_40px_-8px_rgba(16,185,129,.65)]"><MonitorSmartphone className="h-5 w-5" /></span>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-emerald-400">IPTV Smart Player PRO</p>
            <h1 className="text-2xl font-extrabold">Admin dashboard</h1>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className={btn + " border border-white/15 hover:bg-white/10"} onClick={() => load()} disabled={busy}>
            <RefreshCw className={"h-4 w-4 " + (busy ? "animate-spin" : "")} /> Refresh
          </button>
          <button className={btn + " border border-white/15 hover:bg-white/10"} onClick={() => api({ action: "logout" }).finally(onLogout)}>
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </header>

      {msg && <p className="mb-4 rounded-xl border border-red/40 bg-red/10 p-3 text-sm">{msg}</p>}

      <section className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.l} className="glass rounded-2xl p-4">
            <c.i className={"h-5 w-5 " + c.c} />
            <p className="mt-2 text-2xl font-extrabold tabular-nums">{c.v}</p>
            <p className="text-xs text-white/55">{c.l}</p>
          </div>
        ))}
      </section>
      {plats.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {plats.map((p) => (
            <span key={p.platform} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              {p.platform}: <b className="text-white">{p.n}</b>
            </span>
          ))}
        </div>
      )}

      <section className="glass rounded-3xl p-4 sm:p-6">
        <form
          className="mb-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            load(q)
          }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input className={input + " pl-9"} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search client, MAC address, note, playlist name or username" />
          </div>
          <button className={btn + " bg-red glow-red"}>Search</button>
        </form>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-white/45">
              <tr>
                <th className="px-3 py-2">MAC Address</th>
                <th className="px-3 py-2">Client · Licence</th>
                <th className="px-3 py-2">Device Key</th>
                <th className="px-3 py-2">Device</th>
                <th className="px-3 py-2">Last online</th>
                <th className="px-3 py-2">Playlists</th>
                <th className="px-3 py-2">Note</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((d) => (
                <tr key={d.device_id} className="cursor-pointer border-t border-white/5 hover:bg-white/5" onClick={() => setOpen(d.device_id)}>
                  <td className="px-3 py-3 font-mono font-semibold">{d.device_id}</td>
                  <td className="px-3 py-3">
                    <div className="grid gap-1">
                      {d.client_name ? <span className="font-semibold text-white">{d.client_name}</span> : <span className="inline-flex w-fit items-center gap-1 text-xs font-bold text-emerald-300/80"><Plus className="h-3 w-3" /> Add client</span>}
                      <span className={"w-fit whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-bold " + license(d).c}>{license(d).t}</span>
                      {!isLifetime(d) && (
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <button className="rounded-md border border-emerald-400/40 px-2 py-0.5 text-[11px] font-bold text-emerald-300 hover:bg-emerald-400/10" onClick={() => activate(d, false)}>+1 Year $5</button>
                          <button className="rounded-md bg-emerald-500 px-2 py-0.5 text-[11px] font-bold text-white hover:bg-emerald-400" onClick={() => activate(d, true)}>Lifetime $15</button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 font-mono text-white/70">{d.device_key}</td>
                  <td className="px-3 py-3 text-white/70">{d.platform || "—"}</td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-2">
                      <span className={"h-2 w-2 rounded-full " + (online(d.last_seen) ? "bg-emerald-400" : "bg-white/25")} /> {ago(d.last_seen)}
                    </span>
                  </td>
                  <td className="px-3 py-3 tabular-nums">{d.playlists}</td>
                  <td className="max-w-[180px] truncate px-3 py-3 text-white/60">{d.note || ""}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {d.blocked ? <span className="rounded-md bg-red/20 px-2 py-0.5 text-xs font-bold text-red">BLOCKED</span> : <span className="rounded-md bg-emerald-400/15 px-2 py-0.5 text-xs font-bold text-emerald-300">ACTIVE</span>}
                      {d.blocked ? (
                        <button className="rounded-md border border-emerald-400/40 px-2 py-0.5 text-xs font-bold text-emerald-300 hover:bg-emerald-400/10" title="Unblock" onClick={() => quick("block", d, false)}>
                          Unblock
                        </button>
                      ) : (
                        <button className="inline-flex items-center gap-1 rounded-md border border-gold/40 px-2 py-0.5 text-xs font-bold text-gold hover:bg-gold/10" title="Block" onClick={() => quick("block", d, true)}>
                          <Ban className="h-3 w-3" /> Block
                        </button>
                      )}
                      <button className="inline-flex items-center gap-1 rounded-md border border-red/40 px-2 py-0.5 text-xs font-bold text-red hover:bg-red/10" title="Delete" onClick={() => quick("deleteDevice", d)}>
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!devices.length && !busy && <p className="p-6 text-center text-white/55">No devices yet. They appear here as soon as a client opens IPTV Smart Player PRO.</p>}
        </div>
      </section>

      {open && <DeviceModal id={open} onClose={() => setOpen(null)} onChanged={() => load()} />}
    </div>
  )
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-3 backdrop-blur-sm" onClick={onClose}>
      <div className="glass max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-[#0c0a24] p-5 sm:p-7" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold">{title}</h2>
          <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10" onClick={onClose} aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

const emptyPL: PL = { name: "", type: "xtream", server: "", username: "", password: "", url: "", epgUrl: "" }

function DeviceModal({ id, onClose, onChanged }: { id: string; onClose: () => void; onChanged: () => void }) {
  const [d, setD] = useState<Device | null>(null)
  const [pls, setPls] = useState<PL[]>([])
  const [note, setNote] = useState("")
  const [client, setClient] = useState("")
  const [start, setStart] = useState(today())
  const [months, setMonths] = useState(12)
  const [form, setForm] = useState<PL | null>(null)
  const [err, setErr] = useState("")
  const [ok, setOk] = useState("")
  const [busy, setBusy] = useState(false)
  const load = () =>
    api({ action: "device", id }).then((j) => {
      setD(j.device)
      setPls(j.playlists)
      setNote(j.device.note || "")
      setClient(j.device.client_name || "")
      setStart(j.device.sub_start || today())
    })
  useEffect(() => {
    load().catch((e) => setErr(e.message))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])
  const run = async (body: Record<string, unknown>, done: string) => {
    setErr("")
    setOk("")
    setBusy(true)
    try {
      await api({ id, ...body })
      setOk(done)
      await load()
      onChanged()
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setBusy(false)
    }
  }
  if (!d) return <Modal title="Device" onClose={onClose}>{err ? <p className="text-red">{err}</p> : <Loader2 className="h-6 w-6 animate-spin text-red" />}</Modal>
  return (
    <Modal title={d.device_id} onClose={onClose}>
      <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        {[
          ["Device Key", d.device_key],
          ["Device", d.platform || "—"],
          ["Last online", ago(d.last_seen)],
          ["First seen", new Date(d.created_at).toLocaleDateString()],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-white/5 p-3">
            <p className="text-xs text-white/50">{k}</p>
            <p className="font-mono font-semibold">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-emerald-400/25 bg-emerald-400/[.04] p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 font-bold text-emerald-300"><Crown className="h-4 w-4" /> Client &amp; licence</h3>
          <span className={"rounded-md px-2 py-0.5 text-xs font-bold " + license(d).c}>{license(d).t}</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-xs text-white/55">
            Client name
            <input className={input} value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client - John Smith" maxLength={80} />
          </label>
          <label className="grid gap-1 text-xs text-white/55">
            Start date
            <input type="date" className={input + " [color-scheme:dark]"} value={start} onChange={(e) => setStart(e.target.value)} />
          </label>
        </div>
        <p className="mt-3 mb-1.5 text-xs text-white/55">Subscription length</p>
        <div className="flex flex-wrap gap-1.5">
          {PLANS.map(([l, m]) => (
            <button key={m} type="button" onClick={() => setMonths(m)} className={"rounded-full px-3 py-1.5 text-xs font-bold transition " + (months === m ? "bg-emerald-500 text-white" : "border border-white/15 text-white/70 hover:bg-white/10")}>
              {l}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-white/70">
          Paid until <b className="text-white">{fmtDate(addMonths(start || today(), months))}</b> <span className="text-white/45">· prices: $5 / year, $15 lifetime</span>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className={btn + " bg-emerald-500 hover:bg-emerald-400"} disabled={busy || !start} onClick={() => run({ action: "client", client, start, months }, "Client saved")}>
            <CheckCircle2 className="h-4 w-4" /> Save client
          </button>
          {!isLifetime(d) && (
            <button className={btn + " bg-emerald-600 hover:bg-emerald-500"} disabled={busy} onClick={() => confirm("Activate LIFETIME ($15) for this device?") && run({ action: "client", client, lifetime: true }, "Lifetime activated — the app unlocks within a minute")}>
              <InfinityIcon className="h-4 w-4" /> Lifetime $15
            </button>
          )}
          <button className={btn + " border border-cyan/40 text-cyan hover:bg-cyan/10"} disabled={busy} onClick={() => run({ action: "trial", days: 7 }, "New 7-day free trial given")}>
            <Clock className="h-4 w-4" /> New 7-day trial
          </button>
          {d.sub_end && !isLifetime(d) && (
            <button className={btn + " border border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/10"} disabled={busy} onClick={() => run({ action: "client", client, start: d.sub_end! >= today() ? d.sub_end : today(), months }, "Subscription renewed")}>
              <RefreshCw className="h-4 w-4" /> Renew +{PLANS.find((p) => p[1] === months)?.[0]}
            </button>
          )}
          {(d.client_name || d.sub_end) && (
            <button className={btn + " border border-white/15 text-white/60 hover:bg-white/10"} disabled={busy} onClick={() => confirm("Remove client & subscription from this device?") && run({ action: "client", clear: true }, "Client removed")}>
              <X className="h-4 w-4" /> Remove
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <input className={input} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (client name, phone, expiry…)" maxLength={200} />
        <button className={btn + " border border-white/15 hover:bg-white/10"} disabled={busy} onClick={() => run({ action: "note", note }, "Note saved")}>Save</button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {d.blocked ? (
          <button className={btn + " bg-emerald-500/90"} disabled={busy} onClick={() => run({ action: "block", blocked: false }, "Device unblocked")}>
            <CheckCircle2 className="h-4 w-4" /> Unblock
          </button>
        ) : (
          <button className={btn + " bg-red/90"} disabled={busy} onClick={() => confirm("Block this device? Its website playlists disappear from the TV.") && run({ action: "block", blocked: true }, "Device blocked")}>
            <Ban className="h-4 w-4" /> Block
          </button>
        )}
        <button
          className={btn + " border border-red/40 text-red hover:bg-red/10"}
          disabled={busy}
          onClick={async () => {
            if (!confirm("Delete this device and all its playlists?")) return
            await run({ action: "deleteDevice" }, "Deleted")
            onClose()
          }}
        >
          <Trash2 className="h-4 w-4" /> Delete device
        </button>
      </div>

      <h3 className="mt-6 mb-2 font-bold">Playlists</h3>
      <div className="grid gap-2">
        {pls.map((p) => (
          <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 p-3">
            <span className={"rounded-md px-2 py-1 text-[11px] font-extrabold " + (p.type === "xtream" ? "bg-cyan/15 text-cyan" : "bg-violet/15 text-violet")}>{p.type === "xtream" ? "XTREAM" : "M3U"}</span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{p.name}</p>
              <p className="truncate text-xs text-white/50">{p.type === "xtream" ? `${p.server} · ${p.username} · ${p.password}` : p.url}</p>
            </div>
            <button className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10" aria-label="Edit" onClick={() => setForm({ ...p, epgUrl: p.epg_url || "" })}><Pencil className="h-4 w-4" /></button>
            <button className="grid h-8 w-8 place-items-center rounded-full text-red hover:bg-red/10" aria-label="Delete" onClick={() => confirm(`Delete “${p.name}”?`) && run({ action: "deletePlaylist", playlistId: p.id }, "Playlist deleted")}><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        {!pls.length && <p className="text-sm text-white/55">No playlists on this device.</p>}
      </div>

      {form ? (
        <form
          className="mt-4 grid gap-3 rounded-2xl border border-white/10 p-4"
          onSubmit={async (e) => {
            e.preventDefault()
            await run({ action: "savePlaylist", playlist: form }, "Playlist saved — it reaches the TV within a few minutes")
            setForm(null)
          }}
        >
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-black/30 p-1">
            {(["xtream", "m3u"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setForm({ ...form, type: t })} className={"rounded-lg py-2 text-sm font-bold " + (form.type === t ? "bg-red" : "text-white/60")}>{t === "xtream" ? "Xtream Codes" : "M3U link"}</button>
            ))}
          </div>
          <input className={input} placeholder="Playlist name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          {form.type === "xtream" ? (
            <>
              <input className={input} placeholder="Server URL (http://host:port)" value={form.server || ""} onChange={(e) => setForm({ ...form, server: e.target.value })} required />
              <div className="grid gap-3 sm:grid-cols-2">
                <input className={input} placeholder="Username" value={form.username || ""} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
                <input className={input} placeholder="Password" value={form.password || ""} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              </div>
            </>
          ) : (
            <input className={input} placeholder="M3U link" value={form.url || ""} onChange={(e) => setForm({ ...form, url: e.target.value })} required />
          )}
          <input className={input} placeholder="EPG link (optional)" value={form.epgUrl || ""} onChange={(e) => setForm({ ...form, epgUrl: e.target.value })} />
          <div className="flex gap-2">
            <button className={btn + " bg-red glow-red"} disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />} Save playlist</button>
            <button type="button" className={btn + " border border-white/15"} onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      ) : (
        <button className={btn + " mt-3 border border-white/15 hover:bg-white/10"} onClick={() => setForm({ ...emptyPL })}>
          <Plus className="h-4 w-4" /> Add playlist to this TV
        </button>
      )}

      {err && <p className="mt-4 rounded-xl border border-red/40 bg-red/10 p-3 text-sm">{err}</p>}
      {ok && <p className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-200">{ok}</p>}
    </Modal>
  )
}
