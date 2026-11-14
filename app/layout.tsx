import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SITE_URL } from "@/lib/site"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { SiteI18n } from "@/components/site-i18n"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })

const title = "IPTV Smart Player PRO – Premium Player for Firestick, Android TV & Phone"
const description =
  "IPTV Smart Player PRO is a premium media player for Firestick, Android TV, Android phones, Samsung TV and PC. Live TV with EPG, Movies, Series, Sports, Catch-Up and Multi-View. Works with your own Xtream Codes or M3U playlist."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  applicationName: "IPTV Smart Player PRO",
  keywords: ["IPTV player", "Firestick IPTV player", "Android TV player", "M3U player", "Xtream Codes player", "EPG player"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "IPTV Smart Player PRO",
    title,
    description,
    images: [{ url: "/screenshots/tv-home.webp", width: 640, height: 360, alt: "IPTV Smart Player PRO home screen on TV" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/screenshots/tv-home.webp"] },
  icons: { icon: "/icon.svg" },
}

export const viewport: Viewport = { themeColor: "#070616", width: "device-width", initialScale: 1 }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        {children}
        <FloatingWhatsApp />
        <SiteI18n />
      </body>
    </html>
  )
}
