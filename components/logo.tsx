import { Play } from "lucide-react"

export function Logo() {
  return (
    <a href="/" className="flex items-center gap-2.5 font-extrabold tracking-tight" aria-label="IPTV Smart Player PRO home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-red glow-red">
        <Play className="h-5 w-5 text-white" strokeWidth={2.5} />
      </span>
      <span className="text-[17px]">IPTV Smart Player <span className="text-red">PRO</span></span>
    </a>
  )
}
