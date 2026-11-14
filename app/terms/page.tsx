import type { Metadata } from "next"
import { LegalPage } from "@/components/legal"
import { SITE_URL, WHATSAPP_NUMBER, WHATSAPP_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Terms of Use – IPTV Smart Player PRO",
  description: "Terms of use for the IPTV Smart Player PRO media player app and website.",
  alternates: { canonical: "/terms" },
}

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="13 November 2026">
      <p>
        By installing or using the <strong>IPTV Smart Player PRO</strong> app or the website <a href={SITE_URL}>{SITE_URL.replace(/^https?:\/\//, "")}</a> you agree to
        these terms.
      </p>

      <h2>1. A media player only — no content provided</h2>
      <p>
        IPTV Smart Player PRO is a media player. <strong>It does not provide, include, host, sell or link to any channels, films, series, playlists or other content.</strong>
        The app is delivered empty. It only plays the playlists (M3U links or Xtream Codes logins) that you add yourself. We are not connected to, and do not
        endorse, any IPTV or content provider.
      </p>

      <h2>2. Your responsibility</h2>
      <ul>
        <li>You are solely responsible for the playlists and streams you add and watch.</li>
        <li>You must only use content that you have the legal right to watch in your country.</li>
        <li>
          You must not use the app to watch, share or distribute content that infringes copyright or other rights, or to get around any technical protection or
          legal restriction.
        </li>
      </ul>
      <p>We may block devices that are used against these terms.</p>

      <h2>3. Free trial and lifetime licence</h2>
      <ul>
        <li>Every device gets a 7-day free trial with all features.</li>
        <li>
          After the trial, a one-time <strong>lifetime licence</strong> keeps the app working: £15 in the United Kingdom, €15 in euro countries and US$15 in other
          countries (Google Play may show the price in your local currency and include local taxes).
        </li>
        <li>
          In the Google Play version the licence is bought through Google Play and is linked to your Google account. Refunds follow Google Play’s refund policy.
        </li>
        <li>The licence is for the app only. It does not include any channels or content.</li>
      </ul>

      <h2>4. No warranty</h2>
      <p>
        The app is provided “as is”. We do not promise that it will work with every playlist, server, device or network, or that it will be free of errors or
        interruptions. Streams depend on your provider and your internet connection.
      </p>

      <h2>5. Limitation of liability</h2>
      <p>
        To the extent allowed by law, we are not liable for any loss or damage arising from the use of the app, from content you choose to watch, or from services
        of third parties. Nothing in these terms limits rights you have under consumer law that cannot be excluded.
      </p>

      <h2>6. Privacy</h2>
      <p>
        See our <a href="/privacy">Privacy Policy</a> to learn what data the app uses.
      </p>

      <h2>7. Changes</h2>
      <p>We may update these terms. The new version applies from the date shown on this page.</p>

      <h2>8. Contact</h2>
      <p>
        WhatsApp <a href={WHATSAPP_URL}>{WHATSAPP_NUMBER}</a> or our website <a href={SITE_URL}>{SITE_URL.replace(/^https?:\/\//, "")}</a>.
      </p>
    </LegalPage>
  )
}
