import { ChevronDown } from "lucide-react"
import { Reveal, SectionHeading } from "./reveal"

export const FAQS = [
  { q: "Does the app include channels?", a: "No. IPTV Smart Player PRO is a media player only — it does not include, host or sell any channels or content. You add your own playlist from your provider." },
  { q: "Which formats work?", a: "Xtream Codes (Server URL, Username, Password), M3U / M3U8 playlist links, and XMLTV EPG for the TV Guide." },
  { q: "Is it free?", a: "Yes. IPTV Smart Player PRO is free to download and use on Android phones, tablets, Firestick and Android TV." },
  { q: "Why do I need “unknown apps”?", a: "IPTV Smart Player PRO is installed directly from an APK file rather than an app store. Android and Fire OS ask you to allow “Install unknown apps” for the app you install it with (your browser or Downloader). You can turn it off again after installing." },
  { q: "How do I update the app?", a: "Download the latest APK from this page (the link always points to the newest version) and install it over the current app. Your playlists and settings are kept." },
  { q: "How many devices?", a: "You can install IPTV Smart Player PRO on as many of your own devices as you like. How many devices can stream at the same time depends on your playlist provider." },
  { q: "How do I lock adult categories?", a: "Go to Settings › Parental Control, choose the categories to lock and set your own PIN. The default PIN is 0000 — change it straight away." },
]

export function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading eyebrow="FAQ" title="Questions? Answered." />
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 40}>
              <details className="glass group rounded-2xl px-5 py-1 open:bg-white/[.07]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-red transition group-open:rotate-180" />
                </summary>
                <p className="pb-5 text-[15px] leading-relaxed text-white/65">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
