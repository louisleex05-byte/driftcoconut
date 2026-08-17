import type { Metadata } from "next";
import Script from "next/script";
import { LanguageProvider } from "@/contexts/LanguageProvider";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
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
    default: "driftcoconut — find your next stay",
    template: "%s · driftcoconut",
  },
  description: "Discover and compare hotels worldwide. Drift into your next getaway.",
  openGraph: {
    title: "driftcoconut — find your next stay",
    description: "Discover and compare hotels worldwide. Drift into your next getaway.",
    url: SITE_URL,
    siteName: "driftcoconut",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "driftcoconut — find your next stay",
    description: "Discover and compare hotels worldwide. Drift into your next getaway.",
  },
  other: {
    ...(process.env.NEXT_PUBLIC_AGODA_VERIFICATION && {
      "agoda-site-verification": process.env.NEXT_PUBLIC_AGODA_VERIFICATION,
    }),
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
      </body>
    </html>
  );
}
