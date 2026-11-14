import { PLAY_URL } from "@/lib/site"

// "Get it on Google Play" button (opens the Play Store app on Android, the Play website elsewhere)
export function GooglePlayButton({ className = "", href = PLAY_URL }: { className?: string; href?: string }) {
  const external = href.startsWith("http")
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label="Get IPTV Smart Player PRO on Google Play"
      className={`inline-flex items-center justify-center gap-3 rounded-full border border-white/25 bg-black px-6 py-2.5 transition hover:border-white/50 hover:bg-white/5 ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7 shrink-0" aria-hidden="true">
        <path fill="#00D7FE" d="M3.6 2.3c-.3.3-.5.8-.5 1.4v16.6c0 .6.2 1.1.5 1.4l9.3-9.7L3.6 2.3z" />
        <path fill="#FFCE00" d="M16 15.2 12.9 12 16 8.8l3.8 2.2c1.1.6 1.1 1.6 0 2.2L16 15.2z" />
        <path fill="#FF3A44" d="M16 15.2 12.9 12l-9.3 9.7c.4.4 1 .4 1.7 0L16 15.2z" />
        <path fill="#00F076" d="M16 8.8 5.3 2.3c-.7-.4-1.3-.4-1.7 0l9.3 9.7L16 8.8z" />
      </svg>
      <span className="flex flex-col items-start leading-none">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70">Get it on</span>
        <span className="text-lg font-bold">Google Play</span>
      </span>
    </a>
  )
}
