import { PLAY_GROUP_URL, PLAY_TEST_URL } from "@/lib/site"
import { CopyButton } from "./copy-button"
import { GooglePlayButton } from "./google-play-button"

// Google Play is still in testing: anyone can install it by becoming a tester first (2 taps, free).
export function PlayBetaSteps() {
  const steps = [
    { n: 1, title: "Join the testers group", hint: "Tap “Join group” with your Gmail.", url: PLAY_GROUP_URL, label: "Join group" },
    { n: 2, title: "Become a tester", hint: "Same Gmail — tap “Become a tester”.", url: PLAY_TEST_URL, label: "Become a tester" },
  ]
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-cyan/40 bg-cyan/5 p-3 text-sm text-white/75">
        <span className="font-bold text-cyan">Google Play beta:</span> the app is still in testing on Google Play. Become a free tester in 2 steps, then install it from the Play Store. Use the <b>same Gmail</b> as on your phone or TV.
      </div>
      {steps.map((s) => (
        <div key={s.n} className="flex flex-col gap-2">
          <p className="text-sm font-medium text-white/70">
            <span className="mr-2 inline-grid h-5 w-5 place-items-center rounded-full bg-gold text-[11px] font-black text-black">{s.n}</span>
            {s.title} <span className="text-white/45">— {s.hint}</span>
          </p>
          <div className="flex items-center gap-2 rounded-xl border border-gold/40 bg-black/40 p-2 pl-3 shadow-[0_0_30px_-12px_#FFB020]">
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1 break-all font-mono text-xs text-gold underline-offset-2 hover:underline">{s.url.replace("https://", "")}</a>
            <CopyButton text={s.url} />
          </div>
        </div>
      ))}
      <p className="text-sm font-medium text-white/70">
        <span className="mr-2 inline-grid h-5 w-5 place-items-center rounded-full bg-gold text-[11px] font-black text-black">3</span>
        Install it from Google Play:
      </p>
      <GooglePlayButton />
      <p className="text-xs text-white/45">If Google Play says the app isn’t available, wait 5–10 minutes after step 2 and try again.</p>
    </div>
  )
}
