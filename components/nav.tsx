"use client"
import { useEffect, useState } from "react"
import { Menu, X, Download, MonitorSmartphone } from "lucide-react"
import { LangSwitch } from "@/components/site-i18n"
import { Logo } from "./logo"
import { NAV_LINKS } from "@/lib/site"

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-colors ${scrolled || open ? "bg-ink/75 backdrop-blur-xl border-b border-white/10" : "bg-transparent"}`}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <ul className="hidden items-center gap-8 text-sm font-medium text-white/70 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}><a href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="transition hover:text-white">{l.label}</a></li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <LangSwitch />
          <a href="/activate" className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:bg-white/10 sm:inline-flex">
            <MonitorSmartphone className="h-4 w-4" /> Activate TV
          </a>
          <a href="/#download" className="inline-flex items-center gap-2 rounded-full bg-red px-4 py-2 text-sm font-semibold glow-red transition hover:brightness-110">
            <Download className="h-4 w-4" /> Download
          </a>
          <button className="grid h-10 w-10 place-items-center rounded-full md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <ul className="border-t border-white/10 px-4 pb-4 md:hidden">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} onClick={() => setOpen(false)} className="block py-3 text-base font-medium text-white/80">{l.label}</a>
            </li>
          ))}
          <li>
            <a href="/activate" onClick={() => setOpen(false)} className="block py-3 text-base font-semibold text-red">Activate TV</a>
          </li>
        </ul>
      )}
    </header>
  )
}
