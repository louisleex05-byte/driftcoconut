import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Logo from "@/components/Logo";
import HeaderSearch from "@/components/HeaderSearch";
import { Wave, Shell, Coral, Conch, Starfish } from "@/components/Decorations";
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
    <html lang="en">
      <body>
        <header className="bg-white/70 backdrop-blur border-b border-sea-100 sticky top-0 z-30">
          <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 h-16 sm:h-20 flex items-center justify-between gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 group min-w-0 flex-shrink"
            >
              {/* Logo — dominant, bigger than wordmark */}
              <Logo
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0 transition-transform group-hover:-rotate-6"
              />
              <span className="font-display text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-sea-700 leading-none truncate">
                driftcoconut
              </span>
            </Link>

            {/* Center search field — magnify icon + input */}
            <HeaderSearch />

            <nav className="flex items-center gap-3 sm:gap-5 text-sm text-slate-600 flex-shrink-0">
              <a
                href="/#search-form"
                className="md:hidden flex items-center gap-1 hover:text-sea-600 transition-colors"
                aria-label="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </a>
              <Link href="/#deals" className="hover:text-sea-600 transition-colors">
                Deals
              </Link>
              <Link href="/about" className="hover:text-sea-600 transition-colors">
                About
              </Link>
            </nav>
          </div>
        </header>
        <main className="max-w-screen-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8">{children}</main>
        <footer className="relative mt-16 border-t border-sea-100 py-10 bg-white/50 overflow-hidden">
          {/* Ambient waves, corals, and shells in footer */}
          <Wave className="absolute top-0 left-0 w-full h-6 text-sea-300 opacity-80 pointer-events-none" />
          <Coral className="hidden md:block absolute bottom-2 left-4 w-16 text-sea-400 opacity-50 pointer-events-none" />
          <Conch className="hidden md:block absolute bottom-6 right-24 w-12 text-sea-500 opacity-45 pointer-events-none -rotate-12" />
          <Shell className="absolute bottom-4 right-6 w-14 md:w-20 text-sea-400 opacity-55 pointer-events-none" />
          <Starfish className="hidden sm:block absolute top-8 right-1/3 w-10 text-sand-100 opacity-70 pointer-events-none" />

          <div className="max-w-screen-2xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm relative">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Logo className="w-9 h-9" />
                <span className="font-display text-lg font-semibold text-sea-700">driftcoconut</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Search and compare hotels worldwide.
              </p>
            </div>
            <div>
              <div className="font-semibold text-slate-900 mb-2">Company</div>
              <ul className="space-y-1.5 text-slate-500">
                <li><Link href="/about" className="hover:text-sea-600 transition-colors">About</Link></li>
                <li><a href="mailto:hello@driftcoconut.com" className="hover:text-sea-600 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-slate-900 mb-2">Legal</div>
              <ul className="space-y-1.5 text-slate-500">
                <li><Link href="/privacy" className="hover:text-sea-600 transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-sea-600 transition-colors">Terms</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-slate-900 mb-2">Partners</div>
              <ul className="space-y-1.5 text-slate-500 text-xs">
                <li>Agoda</li>
                <li>Expedia · Hotels.com</li>
                <li>Booking.com</li>
                <li>Tripadvisor</li>
              </ul>
            </div>
          </div>
          <div className="max-w-screen-2xl mx-auto px-4 mt-8 pt-6 border-t border-sea-100 text-xs text-slate-400 text-center">
            © {new Date().getFullYear()} driftcoconut. Powered by affiliate partners. Prices and availability subject to change.
          </div>
        </footer>

        {/* Travelpayouts Drive — third-party monetization script.
            Loads after the page is interactive so it never blocks initial render.
            Remove or comment out this <Script> tag anytime to disable Drive. */}
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
