"use client"

import { useEffect, useState } from "react"
import { Globe } from "lucide-react"
import { T } from "@/lib/i18n-dict"

// 6 website languages. Visitor sees their language automatically (by country), or picks one.
export const LANGS = [
  ["en", "English"],
  ["fr", "Français"],
  ["es", "Español"],
  ["de", "Deutsch"],
  ["pt", "Português"],
  ["it", "Italiano"],
] as const
export type Lang = (typeof LANGS)[number][0]
const IDX: Record<string, number> = { fr: 0, es: 1, de: 2, pt: 3, it: 4 }
const ok = (l: string | null | undefined): l is Lang => !!l && (l === "en" || l in IDX)

const BY_COUNTRY: Record<string, Lang> = {}
const set = (l: Lang, cc: string) => cc.split(" ").forEach((c) => (BY_COUNTRY[c] = l))
set("fr", "FR BE LU MC DZ MA TN SN CI CM ML BF NE TD GN BJ TG GA CG CD MG HT RE GP MQ GF NC PF")
set("es", "ES MX AR CO CL PE VE EC GT CU BO DO HN PY SV NI CR PA UY PR GQ")
set("de", "DE AT CH LI")
set("pt", "PT BR AO MZ CV GW ST TL")
set("it", "IT SM VA")

const TITLES: Record<string, string[]> = {
  "IPTV Smart Player PRO – Premium Player for Firestick, Android TV & Phone": [
    "IPTV Smart Player PRO – Lecteur premium pour Firestick, Android TV et téléphone",
    "IPTV Smart Player PRO – Reproductor premium para Firestick, Android TV y móvil",
    "IPTV Smart Player PRO – Premium-Player für Firestick, Android TV & Handy",
    "IPTV Smart Player PRO – Player premium para Firestick, Android TV e celular",
    "IPTV Smart Player PRO – Player premium per Firestick, Android TV e telefono",
  ],
  "Activate your TV – IPTV Smart Player PRO": [
    "Activez votre TV – IPTV Smart Player PRO",
    "Activa tu TV – IPTV Smart Player PRO",
    "TV aktivieren – IPTV Smart Player PRO",
    "Ative sua TV – IPTV Smart Player PRO",
    "Attiva la tua TV – IPTV Smart Player PRO",
  ],
}

function cookie(name: string) {
  return document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"))?.[1]
}

export function detectLang(): Lang {
  try {
    const saved = localStorage.getItem("site-lang")
    if (ok(saved)) return saved
  } catch {}
  const cc = cookie("cc")?.toUpperCase()
  if (cc) return BY_COUNTRY[cc] || "en"
  const nl = (navigator.language || "en").slice(0, 2).toLowerCase()
  return ok(nl) ? nl : "en"
}

let current: Lang = "en"
const listeners = new Set<(l: Lang) => void>()

export function setLang(l: Lang) {
  try {
    localStorage.setItem("site-lang", l)
  } catch {}
  current = l
  listeners.forEach((f) => f(l))
}

const BRAND = "IPTV Smart Player PRO"
const DICT_BRAND = "IPTV " + "PLAYER"
function tr(s: string, l: Lang, dict: Record<string, string[] | readonly string[]> = T) {
  if (l === "en") return s
  const k = s.trim().replace(/\s+/g, " ")
  if (!k) return s
  let v = dict[k]?.[IDX[l]]
  // The dictionary still uses the short app name: look the sentence up with it, then put this site's name back
  if (!v && k.includes(BRAND)) v = dict[k.split(BRAND).join(DICT_BRAND)]?.[IDX[l]]?.split(DICT_BRAND).join(BRAND)
  if (!v) return s
  return (s.match(/^\s*/)?.[0] || "") + v + (s.match(/\s*$/)?.[0] || "")
}

// Remember the English text of each node so we can switch languages back and forth
const texts = new WeakMap<Node, { o: string; a: string }>()
const attrs = new WeakMap<Element, Record<string, { o: string; a: string }>>()
const SKIP = new Set(["SCRIPT", "STYLE", "CODE", "TEXTAREA", "NOSCRIPT"])
const ATTRS = ["placeholder", "aria-label"]
let titleOrig = ""

function apply(l: Lang) {
  if (location.pathname.startsWith("/admin")) return
  document.documentElement.lang = l
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    const p = n.parentElement
    if (!p || SKIP.has(p.tagName) || p.closest("[data-noi18n]")) continue
    const cur = n.nodeValue || ""
    const st = texts.get(n)
    const o = st && cur === st.a ? st.o : cur
    const a = tr(o, l)
    texts.set(n, { o, a })
    if (cur !== a) n.nodeValue = a
  }
  document.body.querySelectorAll("[placeholder],[aria-label]").forEach((el) => {
    if (el.closest("[data-noi18n]")) return
    const m = attrs.get(el) || {}
    for (const at of ATTRS) {
      const cur = el.getAttribute(at)
      if (cur == null) continue
      const o = m[at] && cur === m[at].a ? m[at].o : cur
      const a = tr(o, l)
      m[at] = { o, a }
      if (cur !== a) el.setAttribute(at, a)
    }
    attrs.set(el, m)
  })
  if (!titleOrig || !Object.values(TITLES).some((r) => r.includes(document.title))) titleOrig = document.title
  const t = tr(titleOrig, l, TITLES)
  if (document.title !== t) document.title = t
}

/** Mounted once in the layout: translates the whole page and keeps it translated. */
export function SiteI18n() {
  useEffect(() => {
    if (location.pathname.startsWith("/admin")) return
    current = detectLang()
    let raf = 0
    const run = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => apply(current))
    }
    apply(current)
    const mo = new MutationObserver(run)
    mo.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS })
    const onLang = () => run()
    listeners.add(onLang)
    return () => {
      mo.disconnect()
      listeners.delete(onLang)
      cancelAnimationFrame(raf)
    }
  }, [])
  return null
}

/** Small language picker for the nav bar. */
export function LangSwitch({ className = "" }: { className?: string }) {
  const [l, setL] = useState<Lang>("en")
  useEffect(() => {
    setL(detectLang())
    const f = (x: Lang) => setL(x)
    listeners.add(f)
    return () => {
      listeners.delete(f)
    }
  }, [])
  return (
    <label data-noi18n className={`relative inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold transition hover:bg-white/10 ${className}`}>
      <Globe className="h-4 w-4 shrink-0 text-white/70" aria-hidden="true" />
      <span aria-hidden="true">{l.toUpperCase()}</span>
      <select
        value={l}
        onChange={(e) => setLang(e.target.value as Lang)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        aria-label="Language"
      >
        {LANGS.map(([code, name]) => (
          <option key={code} value={code} className="bg-[#0b0a1f] text-white">
            {name}
          </option>
        ))}
      </select>
    </label>
  )
}
