import { Nav } from "@/components/nav"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Screenshots } from "@/components/screenshots"
import { Download } from "@/components/download"
import { SetupGuide } from "@/components/setup-guide"
import { FAQ, FAQS } from "@/components/faq"
import { Footer } from "@/components/footer"
import { APK_URL, SITE_URL } from "@/lib/site"

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "IPTV Smart Player PRO",
    operatingSystem: "Android, Fire OS, Android TV",
    applicationCategory: "MultimediaApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    downloadUrl: APK_URL,
    url: SITE_URL,
    screenshot: `${SITE_URL}/screenshots/tv-home.webp`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
]

export default function Page() {
  return (
    <div className="bg-aurora min-h-screen overflow-x-clip">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <main>
        <Hero />
        <Features />
        <Screenshots />
        <Download />
        <SetupGuide />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
