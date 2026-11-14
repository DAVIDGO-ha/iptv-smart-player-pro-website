import { Suspense } from "react"
import type { Metadata } from "next"
import { Nav } from "@/components/nav"
import { Footer } from "@/components/footer"
import { ActivatePortal } from "@/components/activate-portal"

const title = "Activate your TV – IPTV Smart Player PRO"
const description =
  "Enter the MAC Address and Device Key shown on your TV to add your M3U or Xtream Codes playlist from your phone."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/activate" },
  openGraph: { url: "/activate", title, description, siteName: "IPTV Smart Player PRO", type: "website" },
}

export default function ActivatePage() {
  return (
    <div className="bg-aurora min-h-screen overflow-x-clip">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Suspense>
          <ActivatePortal />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
