import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Travel Site — Find your next stay",
  description: "Search and compare hotels worldwide.",
  // Domain verification tags — set NEXT_PUBLIC_* env vars in Vercel to activate.
  // Agoda accepts either a meta tag or an HTML file at /agoda-verification.html
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
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-bold text-brand text-lg">
              TravelSite
            </Link>
            <nav className="flex gap-5 text-sm text-slate-600">
              <Link href="/" className="hover:text-brand">Search</Link>
              <Link href="/#deals" className="hover:text-brand">Deals</Link>
              <Link href="/about" className="hover:text-brand">About</Link>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        <footer className="mt-16 border-t border-slate-200 py-10">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <div className="font-semibold text-slate-900 mb-2">TravelSite</div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Search and compare hotels worldwide.
              </p>
            </div>
            <div>
              <div className="font-semibold text-slate-900 mb-2">Company</div>
              <ul className="space-y-1.5 text-slate-500">
                <li><Link href="/about" className="hover:text-brand">About</Link></li>
                <li><a href="mailto:hello@travelsite.example" className="hover:text-brand">Contact</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-slate-900 mb-2">Legal</div>
              <ul className="space-y-1.5 text-slate-500">
                <li><Link href="/privacy" className="hover:text-brand">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-brand">Terms</Link></li>
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
          <div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400 text-center">
            © {new Date().getFullYear()} TravelSite. Powered by affiliate partners. Prices and availability subject to change.
          </div>
        </footer>
      </body>
    </html>
  );
}
