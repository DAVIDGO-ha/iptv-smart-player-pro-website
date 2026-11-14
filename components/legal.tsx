import { Nav } from "@/components/nav"
import { Footer } from "@/components/footer"

/** Simple page layout for the Privacy Policy and Terms of Use. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="bg-aurora min-h-screen overflow-x-clip">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-white/50">Last updated: {updated}</p>
        <div className="legal mt-8 space-y-6 text-[15px] leading-relaxed text-white/75 [&_a]:text-[#ff4d6d] [&_a]:underline [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_li]:ml-5 [&_li]:list-disc [&_li]:mt-1.5 [&_strong]:text-white">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
