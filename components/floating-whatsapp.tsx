"use client"
import { usePathname } from "next/navigation"
import { WHATSAPP_URL, WHATSAPP_NUMBER } from "@/lib/site"

export function FloatingWhatsApp() {
  const path = usePathname() || ""
  if (path.startsWith("/admin")) return null // website only, not the admin dashboard
  return (
    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label={`Get help on WhatsApp ${WHATSAPP_NUMBER}`} className="fwa-wrap">
      <span className="fwa-label" aria-hidden="true">
        <strong>Get help</strong>
        <span>{WHATSAPP_NUMBER}</span>
      </span>
      <span className="fwa">
        <svg className="fwa__icon" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
          <path d="M16.004 3C8.82 3 3 8.82 3 16.002c0 2.293.6 4.53 1.74 6.5L3 29l6.68-1.712a12.96 12.96 0 0 0 6.32 1.62h.004C23.18 28.908 29 23.088 29 15.906 29 8.72 23.186 3 16.004 3Zm0 23.73h-.004a10.77 10.770 0 0 1-5.490-1.505l-.394-.234-3.964 1.016 1.058-3.864-.257-.396a10.73 10.73 0 0 1-1.65-5.745c0-5.940 4.835-10.773 10.785-10.773 5.940 0 10.718 4.740 10.718 10.680 0 5.940-4.835 10.820-10.802 10.820Zm5.918-8.070c-.324-.162-1.918-.946-2.215-1.054-.297-.108-.513-.162-.729.162-.216.324-.837 1.054-1.026 1.270-.189.216-.378.243-.702.081-.324-.162-1.368-.504-2.606-1.608-.963-.859-1.613-1.920-1.802-2.244-.189-.324-.020-.499.142-.660.146-.145.324-.378.486-.567.162-.189.216-.324.324-.540.108-.216.054-.405-.027-.567-.081-.162-.729-1.756-.999-2.404-.263-.632-.530-.546-.729-.556l-.621-.011a1.190 1.190 0 0 0-.864.405c-.297.324-1.134 1.108-1.134 2.701 0 1.594 1.161 3.134 1.323 3.350.162.216 2.285 3.490 5.536 4.894.774.334 1.378.533 1.849.683.777.247 1.484.212 2.043.129.623-.093 1.918-.784 2.188-1.540.270-.757.270-1.405.189-1.540-.081-.135-.297-.216-.621-.378Z" />
        </svg>
        <span className="fwa__badge" aria-hidden="true">1</span>
      </span>
    </a>
  )
}
