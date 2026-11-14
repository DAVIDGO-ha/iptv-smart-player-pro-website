"use client"
import { useState } from "react"
import { MonitorSmartphone, Flame, Smartphone, Tv, Search, Settings, Link2, PackageCheck, ListPlus, ShieldCheck, FolderOpen, PlayCircle, Store, Server, User, KeyRound, FileText, Lightbulb, ArrowUpDown, CircleDot, Undo2, ChevronsUpDown, Hash } from "lucide-react"
import { APK_URL } from "@/lib/site"
import { CopyButton } from "./copy-button"
import { Reveal, SectionHeading } from "./reveal"

// Downloader app code (aftv.news) — empty until one is created for this website
const DOWNLOADER_CODE: string = ""

type Step = { icon: typeof Flame; text: React.ReactNode }
const TABS: { id: string; label: string; icon: typeof Flame; c: string; steps: Step[] }[] = [
  {
    id: "firestick", label: "Firestick", icon: Flame, c: "#FFB020",
    steps: [
      { icon: Search, text: <>Home › <b>Find</b> › Search <b>“Downloader”</b> › install.</> },
      { icon: Settings, text: <>Settings › My Fire TV › Developer Options › <b>Install unknown apps</b> › Downloader <b>ON</b>.</> },
      { icon: Link2, text: <>Open Downloader, type <b className="text-gold">{APK_URL.replace("https://", "")}</b> and press <b>Go</b>.</> },
      { icon: PackageCheck, text: <><b>Install</b> › <b>Open</b>.</> },
      { icon: MonitorSmartphone, text: <>Note the <b>Device ID</b> and <b>Device Key</b> on the TV, then add your playlist from your phone at <a href="/activate" className="font-semibold text-red underline">Activate TV</a>.</> },
    ],
  },
  {
    id: "android", label: "Android phone", icon: Smartphone, c: "#0A84FF",
    steps: [
      { icon: Link2, text: <>Tap <b>Download APK</b>.</> },
      { icon: ShieldCheck, text: <>Allow <b>“Install unknown apps”</b> for your browser.</> },
      { icon: FolderOpen, text: <>Open the file › <b>Install</b>.</> },
      { icon: PlayCircle, text: <>Open IPTV Smart Player PRO › <b>Add playlist</b>.</> },
    ],
  },
  {
    id: "androidtv", label: "Android TV", icon: Tv, c: "#A855FF",
    steps: [
      { icon: Store, text: <>Install <b>“Downloader”</b> from Google Play.</> },
      { icon: ShieldCheck, text: <>Allow <b>unknown apps</b> for Downloader.</> },
      { icon: Link2, text: <>Open Downloader, type <b className="text-gold">{APK_URL.replace("https://", "")}</b> › <b>Go</b> › <b>Install</b>.</> },
      { icon: PlayCircle, text: <>Open from <b>Apps</b>.</> },
      { icon: MonitorSmartphone, text: <>Scan the QR code on the TV with your phone and add your playlist — no typing with the remote.</> },
    ],
  },
]

const REMOTE = [
  { icon: ArrowUpDown, k: "Arrows", v: "Move" },
  { icon: CircleDot, k: "OK", v: "Select" },
  { icon: Undo2, k: "Back", v: "Return" },
  { icon: ChevronsUpDown, k: "CH+ / CH–", v: "Change channel" },
  { icon: Hash, k: "Numbers", v: "Jump to a channel" },
]

export function SetupGuide() {
  const [tab, setTab] = useState(TABS[0].id)
  const active = TABS.find((t) => t.id === tab)!

  return (
    <section id="setup" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Setup Guide" title="Up and running in minutes" sub="Pick your device and follow the steps." />

        <Reveal>
          <div role="tablist" aria-label="Device" className="glass mx-auto mb-8 flex w-full max-w-lg gap-1 rounded-full p-1.5">
            {TABS.map((t) => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-semibold transition ${tab === t.id ? "bg-red text-white glow-red" : "text-white/60 hover:text-white"}`}>
                <t.icon className="h-4 w-4" /> <span className="truncate">{t.label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <div role="tabpanel" className="glass h-full rounded-3xl p-6 sm:p-8">
              <ol className="space-y-4">
                {active.steps.map((s, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-black" style={{ background: active.c, boxShadow: `0 0 24px -4px ${active.c}`, color: "#0b0a1f" }}>{i + 1}</span>
                    <div className="flex min-w-0 flex-1 items-start gap-3 rounded-2xl bg-white/[.04] p-4">
                      <s.icon className="mt-0.5 h-5 w-5 shrink-0" style={{ color: active.c }} />
                      <p className="text-[15px] leading-relaxed text-white/80 [&_b]:text-white">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              {active.id !== "android" && DOWNLOADER_CODE && (
                <div className="mt-6 rounded-2xl border border-gold/40 bg-gold/10 p-4">
                  <p className="text-sm font-semibold text-gold">Downloader code</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    <span className="font-mono text-4xl font-black tracking-wider text-white">{DOWNLOADER_CODE}</span>
                    <CopyButton text={DOWNLOADER_CODE} />
                  </div>
                  <p className="mt-2 text-sm text-white/70">Works on Firestick, Fire TV, Android TV, Google TV and any Android box with the <b>Downloader</b> app. Or open <b>aftv.news/{DOWNLOADER_CODE}</b> in any browser.</p>
                  <div className="mt-4 space-y-3 rounded-xl bg-white p-4 text-[#333]" aria-label={`Downloader code ${DOWNLOADER_CODE}`}>
                    {[
                      { k: "Code for Downloader App", v: DOWNLOADER_CODE, big: "text-4xl sm:text-5xl", b: "Copy Code" },
                      { k: "Short URL", v: `aftv.news/${DOWNLOADER_CODE}`, big: "text-2xl sm:text-3xl", b: "Copy URL" },
                      { k: "Destination URL", v: APK_URL, big: "text-xs", b: "Copy URL" },
                    ].map((r) => (
                      <div key={r.k} className="rounded-lg border border-[#F47B20]/70 px-3 py-2">
                        <p className="text-sm">{r.k}</p>
                        <div className="flex items-center justify-between gap-3">
                          <span className={`min-w-0 break-all pl-4 ${r.big}`}>{r.v}</span>
                          <span className="shrink-0 rounded-md bg-[#F47B20] px-3 py-1.5 text-sm text-white">{r.b}</span>
                        </div>
                      </div>
                    ))}
                    <p className="text-sm">Enter the code <b>{DOWNLOADER_CODE}</b> in the <span className="text-[#F47B20]">Downloader app</span> to load the destination URL.</p>
                  </div>
                </div>
              )}
              {active.id !== "android" && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 p-2 pl-3">
                  <code className="min-w-0 flex-1 break-all font-mono text-xs text-gold">{APK_URL}</code>
                  <CopyButton text={APK_URL} />
                </div>
              )}
            </div>
          </Reveal>

          <div className="grid gap-5">
            <Reveal delay={80}>
              <div className="glass rounded-3xl p-6 sm:p-8">
                <h3 className="flex items-center gap-2 text-xl font-bold"><ListPlus className="h-5 w-5 text-cyan" /> Add your playlist</h3>
                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-red/40 bg-red/10 p-4">
                    <p className="font-semibold text-red">Easiest: from your phone</p>
                    <p className="mt-2 text-sm text-white/75">Open IPTV Smart Player PRO on your TV, then on your phone go to <b>Activate TV</b>, enter the Device ID + Device Key shown on the TV and add your link. It appears on the TV in seconds.</p>
                    <a href="/activate" className="mt-3 inline-flex items-center gap-2 rounded-full bg-red px-4 py-2 text-sm font-semibold glow-red"><MonitorSmartphone className="h-4 w-4" /> Activate TV</a>
                  </div>
                  <div className="rounded-2xl bg-white/[.04] p-4">
                    <p className="font-semibold text-cyan">Xtream Codes</p>
                    <ul className="mt-2 space-y-1.5 text-sm text-white/75">
                      <li className="flex items-center gap-2"><Server className="h-4 w-4 text-white/40" /> Server URL</li>
                      <li className="flex items-center gap-2"><User className="h-4 w-4 text-white/40" /> Username</li>
                      <li className="flex items-center gap-2"><KeyRound className="h-4 w-4 text-white/40" /> Password</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-white/[.04] p-4">
                    <p className="font-semibold text-violet">M3U</p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-white/75"><FileText className="h-4 w-4 text-white/40" /> Paste your playlist link.</p>
                  </div>
                  <p className="flex gap-2 rounded-2xl border border-gold/30 bg-gold/10 p-4 text-sm text-white/80">
                    <Lightbulb className="h-5 w-5 shrink-0 text-gold" />
                    <span><b className="text-gold">Tip:</b> pasting a link that contains <code className="text-gold">get.php?username=</code> fills in the Xtream details automatically.</span>
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={160}>
              <div className="glass rounded-3xl p-6 sm:p-8">
                <h3 className="text-xl font-bold">Remote tips</h3>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {REMOTE.map((r) => (
                    <li key={r.k} className="flex items-center gap-3 rounded-xl bg-white/[.04] px-3 py-2.5 text-sm">
                      <r.icon className="h-4 w-4 shrink-0 text-red" />
                      <span className="font-semibold">{r.k}</span>
                      <span className="text-white/55">{r.v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
