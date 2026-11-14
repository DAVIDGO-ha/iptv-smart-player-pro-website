"use client"
import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react"
import { SCREENSHOTS } from "@/lib/site"
import { Reveal, SectionHeading } from "./reveal"
import { CountryShot } from "./country-shot"

export function Screenshots() {
  const [idx, setIdx] = useState<number | null>(null)
  const n = SCREENSHOTS.length
  const go = useCallback((d: number) => setIdx((i) => (i === null ? i : (i + d + n) % n)), [n])

  useEffect(() => {
    if (idx === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIdx(null)
      if (e.key === "ArrowRight") go(1)
      if (e.key === "ArrowLeft") go(-1)
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey) }
  }, [idx, go])

  return (
    <section id="screenshots" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Screenshots" title="See it in action" sub="Tap any screenshot to view it fullscreen." />
        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-[1fr_1fr_0.42fr] md:items-end md:overflow-visible md:px-0">
          {SCREENSHOTS.map((s, i) => {
            const phone = s.h > s.w
            return (
              <Reveal key={s.name} delay={i * 90} className={`shrink-0 snap-center ${phone ? "w-[46%] md:w-auto" : "w-[85%] md:w-auto"}`}>
                <button onClick={() => setIdx(i)} className="group block w-full text-left" aria-label={`Open ${s.caption} fullscreen`}>
                  <div className={`glass relative overflow-hidden p-2 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_0_60px_-12px_rgba(168,85,255,.7)] ${phone ? "rounded-[28px]" : "rounded-3xl"}`}>
                    <CountryShot name={s.name} alt={`IPTV Smart Player PRO ${s.caption}`} width={s.w} height={s.h} className={`w-full object-cover ${phone ? "aspect-[9/19.5] rounded-[22px]" : "aspect-video rounded-2xl"}`} />
                    <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-black/50 opacity-0 backdrop-blur transition group-hover:opacity-100"><Expand className="h-4 w-4" /></span>
                  </div>
                  <p className="mt-3 text-center text-sm font-semibold text-white/70">{s.caption}</p>
                </button>
              </Reveal>
            )
          })}
        </div>
      </div>

      {idx !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label={SCREENSHOTS[idx].caption} onClick={() => setIdx(null)}>
          <button className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Close" onClick={() => setIdx(null)}><X /></button>
          <button className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Previous" onClick={(e) => { e.stopPropagation(); go(-1) }}><ChevronLeft /></button>
          <button className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Next" onClick={(e) => { e.stopPropagation(); go(1) }}><ChevronRight /></button>
          <figure className="flex max-h-full max-w-6xl flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <CountryShot key={SCREENSHOTS[idx].name} name={SCREENSHOTS[idx].name} alt={`IPTV Smart Player PRO ${SCREENSHOTS[idx].caption}`} width={SCREENSHOTS[idx].w} height={SCREENSHOTS[idx].h} className="max-h-[82vh] w-auto rounded-2xl object-contain" />
            <figcaption className="mt-4 text-sm font-semibold text-white/80">{SCREENSHOTS[idx].caption} · {idx + 1}/{n}</figcaption>
          </figure>
        </div>
      )}
    </section>
  )
}
