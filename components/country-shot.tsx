"use client"

import Image, { type ImageProps } from "next/image"
import { useEffect, useState } from "react"

// Countries that have their own app screenshots (flag + app language), same list as in the app.
export const SHOT_COUNTRIES = ["gb", "ie", "us", "ca", "de", "at", "ch", "fr", "be", "nl", "es", "pt", "it", "se", "au", "ma"]
const TZ: Record<string, string> = {
  "Europe/London": "gb", "Europe/Dublin": "ie", "Europe/Berlin": "de", "Europe/Vienna": "at", "Europe/Zurich": "ch",
  "Europe/Paris": "fr", "Europe/Brussels": "be", "Europe/Amsterdam": "nl", "Europe/Madrid": "es", "Europe/Lisbon": "pt",
  "Europe/Rome": "it", "Europe/Stockholm": "se", "Africa/Casablanca": "ma",
}

let cached = ""
/** Visitor's country (from Vercel's IP country cookie, else time zone). Falls back to the UK. */
export function shotCountry(): string {
  if (cached) return cached
  let cc = document.cookie.match(/(?:^|; )cc=([^;]*)/)?.[1]?.toLowerCase() || ""
  if (cc === "uk") cc = "gb"
  if (!SHOT_COUNTRIES.includes(cc)) {
    let tz = ""
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "" } catch {}
    cc = cc ? "" : TZ[tz] || (/^Australia\//.test(tz) ? "au" : /^America\/(Toronto|Vancouver|Edmonton|Winnipeg|Halifax|St_Johns|Regina|Montreal)/.test(tz) ? "ca" : /^America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Detroit)/.test(tz) ? "us" : "")
  }
  return (cached = SHOT_COUNTRIES.includes(cc) ? cc : "gb")
}

export function useShotCountry() {
  const [cc, setCc] = useState<string | null>(null)
  useEffect(() => setCc(shotCountry()), [])
  return cc
}

/** App screenshot in the visitor's country version (flag + language). name: tv-home | tv-live | phone-home */
export function CountryShot({ name, className = "", ...props }: Omit<ImageProps, "src"> & { name: string }) {
  const cc = useShotCountry()
  const [failed, setFailed] = useState(false)
  return (
    <Image
      {...props}
      src={failed ? `/screenshots/${name}.webp` : `/screenshots/${cc || "gb"}/${name}.webp`}
      onError={() => setFailed(true)}
      className={`${className} transition-opacity duration-300 ${cc ? "opacity-100" : "opacity-0"}`}
    />
  )
}
