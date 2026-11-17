import { Crown, Smartphone, Flame, Tv, MonitorPlay, Monitor, Apple, Laptop, Download as DL, Clock, Info } from "lucide-react"
import { APK_URL, dl } from "@/lib/site"
import { CopyButton } from "./copy-button"
import { PlayBetaSteps } from "./play-beta-steps"
import { Reveal, SectionHeading } from "./reveal"

type Btn = { label: string; href: string }
type Device = { icon: typeof Smartphone; name: string; c: string; brands?: string; buttons?: Btn[]; code?: boolean; note?: string; soon?: boolean; play?: boolean }

const DEVICES: Device[] = [
  {
    icon: Smartphone, name: "Android phone & tablet", c: "#0A84FF",
    brands: "Samsung, Xiaomi, Oppo, Huawei, Pixel… Android 7 or newer", buttons: [{ label: "Download APK", href: dl("android") }],
    note: "If Android warns you, tap Install anyway.",
  },
  {
    icon: Tv, name: "Android TV / Google TV", c: "#A855FF",
    brands: "Sony, TCL, Philips, Hisense, Sharp, Xiaomi Mi Box, Nvidia Shield, Chromecast with Google TV", buttons: [{ label: "Download APK", href: dl("android") }],
    note: "Use the Downloader app on your TV, like on a Firestick.",
  },
  {
    icon: Flame, name: "Firestick / Fire TV", c: "#FFB020", code: true,
    brands: "Fire TV Stick, Lite, 4K, 4K Max, Fire TV Cube, Fire TV smart TVs",
  },
  {
    icon: MonitorPlay, name: "Samsung Smart TV", c: "#22D3EE", buttons: [{ label: "Download TV package", href: dl("samsung") }],
    brands: "Tizen TVs 2017 and newer", note: "Install with Tizen Studio (Developer Mode). Easiest: plug in a Firestick.",
  },
  {
    icon: Monitor, name: "LG Smart TV", c: "#0A84FF", buttons: [{ label: "Download .ipk", href: dl("lg") }],
    brands: "webOS TVs 2018 and newer", note: "Install with the LG Developer Mode app. Easiest: plug in a Firestick.",
  },
  {
    icon: Laptop, name: "Windows PC & laptop", c: "#22D3EE", buttons: [{ label: "Download for Windows", href: dl("windows") }],
    brands: "Windows 10 & 11 (64-bit)", note: "If Windows warns you, click More info › Run anyway.",
  },
  {
    icon: Apple, name: "Mac", c: "#FFB020", buttons: [{ label: "Download for Mac (M1–M4)", href: dl("mac") }, { label: "Download for Mac (Intel)", href: dl("macintel") }],
    brands: "Intel & Apple Silicon (M1–M4)", note: "First time: right-click the app › Open.",
  },
  {
    icon: Laptop, name: "Linux", c: "#A855FF", buttons: [{ label: "Download AppImage", href: dl("linux") }],
    brands: "Ubuntu, Mint, Fedora, Debian…", note: "Make it executable, then double-click.",
  },
  {
    icon: Tv, name: "Other Smart TVs", c: "#0A84FF",
    brands: "Hisense VIDAA, Roku, Vizio, Panasonic, Philips Saphi…", note: "These TVs can’t install outside apps. Plug in a Firestick or Android TV box and install IPTV Smart Player PRO on it.",
  },
  { icon: Apple, name: "iPhone, iPad & Apple TV", c: "#FFB020", soon: true, brands: "App Store version in progress" },
]

export function Download() {
  return (
    <section id="download" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Download" title="Get IPTV Smart Player PRO on every screen" sub="Android phones, tablets, Android TV, Firestick, TVs and computers: free download. Add your own playlist and start watching." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEVICES.map((d, i) => (
            <Reveal key={d.name} delay={(i % 3) * 80}>
              <div className={`glass flex h-full flex-col rounded-3xl p-6 ${d.soon ? "opacity-70" : ""}`}>
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl" style={{ background: `${d.c}22`, boxShadow: `0 0 28px -6px ${d.c}` }}>
                    <d.icon className="h-6 w-6" style={{ color: d.c }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{d.name}</h3>
                    {d.brands && <p className="text-xs text-white/50">{d.brands}</p>}
                  </div>
                </div>

                <div className="mt-5 flex flex-1 flex-col justify-end gap-3">
                  {d.note && (
                    <p className="flex gap-2 text-sm text-white/60">
                      <Info className="mt-0.5 h-4 w-4 shrink-0 text-white/40" /> {d.note}
                    </p>
                  )}
                  {d.play && <PlayBetaSteps />}
                  {d.code && (
                    <>
                      <p className="text-sm font-medium text-white/70">Downloader app code:</p>
                      <div className="flex items-center gap-3 rounded-xl border border-gold/40 bg-black/40 p-2 pl-3">
                        <span className="flex-1 font-mono text-2xl font-black tracking-wider text-gold">4935306</span>
                        <CopyButton text="4935306" />
                      </div>
                      <p className="text-sm font-medium text-white/70">Or enter this link:</p>
                      <div className="flex items-center gap-2 rounded-xl border border-gold/40 bg-black/40 p-2 pl-3 shadow-[0_0_30px_-12px_#FFB020]">
                        <code className="min-w-0 flex-1 break-all font-mono text-xs text-gold">{APK_URL}</code>
                        <CopyButton text={APK_URL} />
                      </div>
                    </>
                  )}
                  {d.buttons?.map((b) => (
                    <a key={b.href} href={b.href} className="inline-flex items-center justify-center gap-2 rounded-full bg-red px-5 py-3 font-semibold glow-red transition hover:brightness-110">
                      <DL className="h-5 w-5" /> {b.label}
                    </a>
                  ))}
                  {d.soon && (
                    <span className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 font-semibold text-white/60">
                      <Clock className="h-5 w-5" /> Coming soon
                    </span>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
