import type { Metadata } from "next"
import { LegalPage } from "@/components/legal"
import { SITE_URL, WHATSAPP_NUMBER, WHATSAPP_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Privacy Policy – IPTV Smart Player PRO",
  description: "What data the IPTV Smart Player PRO app and website collect, why, and how to delete it.",
  alternates: { canonical: "/privacy" },
}

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="13 November 2026">
      <p>
        This policy explains what information the <strong>IPTV Smart Player PRO</strong> app (Android, Android TV, Fire TV, Google Play, Samsung, LG, Windows, Mac and Linux
        versions) and the website <a href={SITE_URL}>{SITE_URL.replace(/^https?:\/\//, "")}</a> collect, why, and how you can have it deleted.
      </p>
      <p>
        <strong>IPTV Smart Player PRO is a media player only.</strong> It does not include, host, sell or provide any channels, films, series or other content. You add your
        own playlist from a provider of your choice.
      </p>

      <h2>1. Information we collect</h2>
      <ul>
        <li>
          <strong>Device ID (shown as “MAC Address”) and Device Key.</strong> On Android the app creates the Device ID from the Android ID of the device; on
          computers from the network adapter address. The Device Key is a random 6-digit number made by the app. We use them to link the device to the website (so
          you can add playlists from your phone), to run the 7-day free trial and the lifetime licence, and to stop abuse.
        </li>
        <li>
          <strong>Playlists you add on the website.</strong> When you add a playlist at <a href={`${SITE_URL}/activate`}>/activate</a>, we store the server address,
          username and password, or the M3U link, so the app can download it to your device. Playlists you add directly inside the app stay on your device and are
          not sent to us.
        </li>
        <li>
          <strong>Error reports.</strong> When a playlist fails to load, the app sends us the IPTV server name, the error message and the Device ID, so we can help
          you and fix problems.
        </li>
        <li>
          <strong>App information.</strong> Device type (for example “Fire TV” or “Android”), app version and the last time the app connected.
        </li>
      </ul>
      <p>
        We do <strong>not</strong> collect your name, e-mail address, phone number, location, contacts, photos or files. What you watch, your favourites and your
        watch history are stored only on your device. The app has no adverts and no advertising or analytics trackers.
      </p>

      <h2>2. Purchases</h2>
      <p>
        In the Google Play version, the lifetime licence is paid through <strong>Google Play</strong>. Google handles the payment; we never see or store your card or
        payment details. The app only asks Google Play whether your Google account owns the licence. Google’s privacy policy applies to the payment.
      </p>

      <h2>3. How we use the information</h2>
      <ul>
        <li>To deliver the playlists you add on the website to your device.</li>
        <li>To run the free trial and check your licence.</li>
        <li>To give support and fix loading problems.</li>
        <li>To block devices that abuse the service.</li>
      </ul>
      <p>We do not sell your information and we do not share it with anyone for advertising.</p>

      <h2>4. Service providers</h2>
      <p>
        Our website and database run on hosting providers (Vercel and a managed database provider) that store the data for us under contract. The QR codes shown on
        the TV are drawn by the goQR.me image service, which receives the web address in the code (this may include your Device ID). We do not give your data to
        any other third party, unless the law requires it.
      </p>

      <h2>5. Security</h2>
      <p>All data sent between the app and our servers is encrypted in transit (HTTPS).</p>

      <h2>6. How long we keep data and how to delete it</h2>
      <p>
        We keep the data while the device uses the app. You can delete it at any time:
      </p>
      <ul>
        <li>
          In the app, open <strong>Settings › Reset Device Key</strong> — this disconnects the device and removes its playlists from our server.
        </li>
        <li>
          Or ask us to delete everything linked to your device: send your MAC Address on WhatsApp <a href={WHATSAPP_URL}>{WHATSAPP_NUMBER}</a>. We delete it within
          30 days.
        </li>
      </ul>
      <p>Uninstalling the app deletes everything stored on the device.</p>

      <h2>7. Children</h2>
      <p>The app is not directed at children under 13 and we do not knowingly collect data from children.</p>

      <h2>8. Changes</h2>
      <p>If we change this policy we will update this page and the date above.</p>

      <h2>9. Contact</h2>
      <p>
        Questions about privacy: WhatsApp <a href={WHATSAPP_URL}>{WHATSAPP_NUMBER}</a> or our website <a href={SITE_URL}>{SITE_URL.replace(/^https?:\/\//, "")}</a>.
      </p>
    </LegalPage>
  )
}
