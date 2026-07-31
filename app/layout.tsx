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
              <Link href="/">Search</Link>
              <Link href="/#deals">Deals</Link>
              <Link href="/#about">About</Link>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        <footer className="mt-16 border-t border-slate-200 py-8 text-center text-sm text-slate-500">
          Powered by Agoda affiliate API. Prices and availability are subject to change.
        </footer>
      </body>
    </html>
  );
}
