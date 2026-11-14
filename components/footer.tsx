import { Logo } from "./logo"
import { NAV_LINKS, WHATSAPP_URL, WHATSAPP_NUMBER } from "@/lib/site"

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm text-white/55">IPTV Smart Player PRO does not provide, host or sell any media content.</p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110">
            Contact us on WhatsApp · {WHATSAPP_NUMBER}
          </a>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm text-white/65 sm:grid-cols-3">
            {NAV_LINKS.map((l) => <li key={l.href}><a href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="hover:text-white">{l.label}</a></li>)}
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 text-xs text-white/40 sm:px-6">
        <p>© 2026 IPTV Smart Player PRO. All rights reserved.</p>
        <a href="/privacy" className="hover:text-white">Privacy Policy</a>
        <a href="/terms" className="hover:text-white">Terms of Use</a>
      </div>
    </footer>
  )
}
