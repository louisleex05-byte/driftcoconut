// Trust strip shown under the hero — communicates who we source inventory from.
// Uses styled text logotypes (no official logo images) — this is the safe route
// until each affiliate program approves your account and provides co-branded assets.

const PARTNERS: { name: string; color: string; note: string }[] = [
  { name: "agoda", color: "#F41B4A", note: "Asia-Pacific specialist" },
  { name: "Booking.com", color: "#003580", note: "Global inventory" },
  { name: "Expedia", color: "#FFC72C", note: "Bundle & save" },
  { name: "Hotels.com", color: "#D32F2F", note: "Rewards program" },
  { name: "Tripadvisor", color: "#00AF87", note: "Real reviews" },
];

import { Wave, Pebble } from "./Decorations";

export default function PartnerStrip() {
  return (
    <section
      aria-label="Our booking partners"
      className="relative mt-6 mb-10 border-y border-sea-100 bg-white/50 overflow-hidden"
    >
      {/* Wave divider top */}
      <Wave className="absolute -top-3 left-0 w-full h-6 text-sea-200" />
      {/* Pebble accents at edges */}
      <Pebble className="hidden sm:block absolute bottom-2 left-4 w-16 text-sea-300 opacity-40 pointer-events-none" />
      <Pebble className="hidden sm:block absolute bottom-2 right-4 w-16 text-sea-300 opacity-40 -scale-x-100 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 py-6 relative z-10">
        <div className="text-center text-xs uppercase tracking-widest text-slate-500 mb-4">
          Live inventory from trusted booking partners
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-8 gap-y-4">
          {PARTNERS.map((p) => (
            <div
              key={p.name}
              className="flex flex-col items-center"
              title={p.note}
            >
              <span
                className="text-base sm:text-lg md:text-xl font-bold tracking-tight"
                style={{ color: p.color }}
              >
                {p.name}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">
                {p.note}
              </span>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="text-green-600">✓</span> Best price guarantee
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="text-green-600">✓</span> Free cancellation on most rooms
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="text-green-600">✓</span> Secure partner checkout
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="text-green-600">✓</span> No booking fees
          </span>
        </div>
      </div>
    </section>
  );
}
