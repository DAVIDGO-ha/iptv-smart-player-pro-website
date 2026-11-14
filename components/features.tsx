import { Radio, CalendarDays, Clapperboard, Trophy, History, LayoutGrid, Sparkles, Subtitles, Lock, Heart, Gamepad2, ListPlus } from "lucide-react"
import { Reveal, SectionHeading } from "./reveal"

const C = { red: "#0A84FF", gold: "#FFB020", violet: "#A855FF", cyan: "#22D3EE" }
const FEATURES = [
  { icon: Radio, title: "Live TV with EPG", text: "Now & next info on every channel, right in the list.", c: C.red },
  { icon: CalendarDays, title: "Full TV Guide", text: "A smooth, scrollable grid guide with XMLTV support.", c: C.gold },
  { icon: Clapperboard, title: "Movies & Series with resume", text: "Pick up exactly where you left off, on any episode.", c: C.violet },
  { icon: Trophy, title: "Sports section", text: "All sports channels and events gathered in one place.", c: C.cyan },
  { icon: History, title: "Catch-Up TV", text: "Missed it? Rewind supported channels up to days back.", c: C.red },
  { icon: LayoutGrid, title: "Multi-View (4 screens)", text: "Watch up to four streams at once on one screen.", c: C.gold },
  { icon: Sparkles, title: "4K / HDR playback", text: "Hardware-accelerated decoding for crisp, rich picture.", c: C.violet },
  { icon: Subtitles, title: "Subtitles & audio tracks", text: "Switch language, subtitles and audio in one tap.", c: C.cyan },
  { icon: Lock, title: "Parental PIN lock", text: "Hide and lock any category behind a PIN.", c: C.red },
  { icon: Heart, title: "Favorites & history", text: "Your favourite channels and recently watched, always first.", c: C.gold },
  { icon: Gamepad2, title: "TV remote friendly", text: "Built for D-pad navigation on Firestick and Android TV.", c: C.violet },
  { icon: ListPlus, title: "Multiple playlists", text: "Add several Xtream or M3U playlists and switch instantly.", c: C.cyan },
]

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Features" title="Everything you expect. Nothing you don't." sub="A player designed for the big screen and the small one." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 4) * 70}>
              <div className="glass group h-full rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/[.08]">
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl" style={{ background: `${f.c}22`, boxShadow: `0 0 30px -6px ${f.c}` }}>
                  <f.icon className="h-6 w-6" style={{ color: f.c }} />
                </div>
                <h3 className="text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
