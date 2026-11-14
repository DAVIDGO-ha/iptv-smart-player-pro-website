import { CountryShot } from "./country-shot"
import { Download, BookOpen, Tv, Smartphone, MonitorSmartphone } from "lucide-react"
import { APK_URL } from "@/lib/site"

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-10 pb-20 sm:pt-16 sm:pb-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr]">
        <div className="text-center lg:text-left">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-white/80">
            <span className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_10px_#22d3ee]" />
            Firestick · Android TV · Phone · Samsung TV · PC
          </span>
          <h1 className="mt-6 text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl xl:text-7xl">
            Your TV.<br /><span className="text-gradient">Beautifully Organised.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/65 lg:mx-0">
            Live TV, Movies, Series, Sports and TV Guide in one premium player. Works with Xtream Codes and M3U playlists — add yours from your phone.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap lg:justify-start">
            <a href={APK_URL} className="inline-flex items-center justify-center gap-2 rounded-full bg-red px-7 py-3.5 font-semibold glow-red transition hover:brightness-110">
              <Download className="h-5 w-5" /> Download APK
            </a>
            <a href="/activate" className="glass inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-semibold transition hover:bg-white/10">
              <MonitorSmartphone className="h-5 w-5" /> Activate my TV
            </a>
            <a href="/#setup" className="glass inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-semibold transition hover:bg-white/10">
              <BookOpen className="h-5 w-5" /> Setup Guide
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-white/50 lg:justify-start">
            <span className="flex items-center gap-2"><Tv className="h-4 w-4 text-gold" /> TV remote ready</span>
            <span className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-violet" /> Touch optimised</span>
            <span className="hidden items-center gap-2 sm:flex"><MonitorSmartphone className="h-4 w-4 text-cyan" /> 4K / HDR</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl pb-10 sm:pb-16">
          <div className="pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgba(168,85,255,.45),transparent)] blur-2xl" />
          <div className="relative">
            <div className="rounded-[22px] border border-white/15 bg-black p-2 shadow-[0_0_80px_-10px_rgba(255,45,58,.55),0_0_140px_-20px_rgba(168,85,255,.6)] sm:p-3">
              <CountryShot name="tv-home" alt="IPTV Smart Player PRO home screen on a TV" width={1280} height={720} priority className="aspect-video w-full rounded-[14px] object-cover" />
            </div>
            <div className="mx-auto h-4 w-1/3 rounded-b-xl bg-gradient-to-b from-white/20 to-transparent" />
          </div>
          <div className="animate-float absolute -bottom-2 right-0 w-[26%] min-w-[96px] sm:-right-4">
            <div className="rounded-[26px] border border-white/20 bg-black p-1.5 shadow-[0_20px_60px_-10px_rgba(0,0,0,.8),0_0_50px_-10px_rgba(34,211,238,.55)]">
              <div className="relative overflow-hidden rounded-[20px]">
                <div className="absolute left-1/2 top-1.5 z-10 h-3 w-10 -translate-x-1/2 rounded-full bg-black" />
                <CountryShot name="phone-home" alt="IPTV Smart Player PRO home screen on a phone" width={480} height={1040} className="aspect-[9/19.5] w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
