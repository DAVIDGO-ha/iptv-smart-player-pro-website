export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.iptv-smart-player-pro.com").replace(/\/$/, "")
// Files are built by GitHub Actions and published to Releases › latest
export const RELEASE_URL = "https://github.com/DAVIDGO-ha/iptv-smart-player-pro/releases/latest/download"
export const FILES: Record<string, string> = {
  android: "IPTV-Smart-Player-PRO.apk",
  windows: "IPTV-Smart-Player-PRO-Windows.exe",
  mac: "IPTV-Smart-Player-PRO-Mac-arm64.dmg", // Apple M1–M4
  macintel: "IPTV-Smart-Player-PRO-Mac-x64.dmg", // older Intel Macs
  linux: "IPTV-Smart-Player-PRO-Linux.AppImage",
  lg: "IPTV-Smart-Player-PRO-LG-webOS.ipk",
  samsung: "IPTV-Smart-Player-PRO-Samsung-Tizen.zip",
  web: "IPTV-Smart-Player-PRO-Web.zip",
}
// Google Play (Android phones, tablets and Android TV)
export const PLAY_URL = "https://play.google.com/store/apps/details?id=com.smartplayerpro.tv"
// While the app is in testing on Google Play: 1) join the testers group 2) become a tester 3) install
export const PLAY_GROUP_URL = ""
export const PLAY_TEST_URL = "https://play.google.com/apps/testing/com.smartplayerpro.tv"
export const GITHUB_APK_URL = `${RELEASE_URL}/${FILES.android}`
// Short link for Android / Firestick (works in the Downloader app)
export const APK_URL = `${SITE_URL}/download`
export const dl = (platform: keyof typeof FILES | string) => (platform === "android" ? "/download" : `/download/${platform}`)
export const WHATSAPP_NUMBER = "+44 7473 986835"
export const WHATSAPP_URL = "https://wa.me/447473986835?text=" + encodeURIComponent("Hi, I need help with IPTV Smart Player PRO")
export const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#screenshots", label: "Screenshots" },
  { href: "/#download", label: "Download" },
  { href: "/#setup", label: "Setup Guide" },
  { href: "/#faq", label: "FAQ" },
  { href: WHATSAPP_URL, label: "Contact" },
]
export const SCREENSHOTS = [
  // One set per country in /screenshots/<cc>/ (flag + app language follow the visitor's country)
  { name: "tv-home", caption: "Home – TV", w: 1280, h: 720 },
  { name: "tv-live", caption: "Live TV – TV", w: 1280, h: 720 },
  { name: "phone-home", caption: "Home – Phone", w: 480, h: 1040 },
]
