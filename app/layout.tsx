import type { Metadata } from "next";
import Script from "next/script";
import { LanguageProvider } from "@/contexts/LanguageProvider";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CueLinksScript from "@/components/CueLinksScript";
import "./globals.css";

// Travelpayouts Drive script — loaded via env var so it's easy to toggle.
// Set NEXT_PUBLIC_TRAVELPAYOUTS_SRC in Vercel env vars to enable.
const TP_DRIVE_SRC =
  process.env.NEXT_PUBLIC_TRAVELPAYOUTS_SRC ||
  "https://emrld.ltd/NTYxMTY4.js?t=561168";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://driftcoconut.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // Keyword-rich for Google results; the on-page hero carries the brand line.
    default: "driftcoconut — Asia travel guides & where to stay",
    template: "%s · driftcoconut",
  },
  description: "Honest local Asia travel guides and neighborhood advice. Know where to stay, then book through Booking.com.",
  openGraph: {
    title: "driftcoconut — Travel Asia like someone who knows the place.",
    description: "Honest local Asia travel guides and neighborhood advice. Know where to stay, then book through Booking.com.",
    url: SITE_URL,
    siteName: "driftcoconut",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "driftcoconut — Travel Asia like someone who knows the place.",
    description: "Honest local Asia travel guides and neighborhood advice. Know where to stay, then book through Booking.com.",
  },
  other: {
    ...(process.env.NEXT_PUBLIC_AGODA_VERIFICATION && {
      "agoda-site-verification": process.env.NEXT_PUBLIC_AGODA_VERIFICATION,
    }),
    // CueLinks affiliate network - domain-ownership verification
    // Token expires 25-Sep-2026 09:22 AM. Once CueLinks confirms verification,
    // the tag can stay in place indefinitely (they don't re-check).
    "cuelinks-verification": "VERIFY-CL-EMDYHQDD",
    // Pinterest business account - domain claim verification
    "p:domain_verify": "fe0d341e2a2340f0c221ac614574aa92",
    // Bing Webmaster Tools - HTML meta tag verification
    "msvalidate.01": "5E684B660F9D69B202815B5BED51CD6E",
  },
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LanguageProvider>
          <SiteHeader />
          <main className="max-w-screen-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8">{children}</main>
          <SiteFooter />
        </LanguageProvider>

        <Script
          id="travelpayouts-drive"
          src={TP_DRIVE_SRC}
          strategy="afterInteractive"
          data-cmp-ab="2"
        />

        <GoogleAnalytics />
        <CueLinksScript />
      </body>
    </html>
  );
}
