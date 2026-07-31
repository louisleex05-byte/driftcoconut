import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Wave, Shell } from "@/components/Decorations";
import "./globals.css";

export const metadata: Metadata = {
  title: "driftcoconut — find your next stay",
  description: "Discover and compare hotels worldwide. Drift into your next getaway.",
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
          <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 group min-w-0 flex-shrink"
            >
              <Logo
                className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 transition-transform group-hover:-rotate-6"
              />
              <span className="font-display text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-sea-700 leading-none truncate">
                driftcoconut
              </span>
            </Link>
            <nav className="flex items-center gap-3 sm:gap-6 text-sm text-slate-600 flex-shrink-0">
              <Link href="/" className="hidden sm:inline hover:text-sea-600 transition-colors">
                Search
              </Link>
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
          {/* Ambient wave & shell in footer */}
          <Wave className="absolute top-0 left-0 w-full h-6 text-sea-200 opacity-60 pointer-events-none" />
          <Shell className="hidden md:block absolute bottom-4 right-6 w-16 text-sea-300 opacity-30 pointer-events-none" />

          <div className="max-w-screen-2xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm relative">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Logo className="w-6 h-6" />
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
      </body>
    </html>
  );
}
