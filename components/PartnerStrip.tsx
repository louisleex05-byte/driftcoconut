// Trust strip shown under the hero — communicates who we source inventory from.
// Uses styled text logotypes (no official logo images) — this is the safe route
// until each affiliate program approves your account and provides co-branded assets.

import { Wave, Pebble, Coral, Conch } from "./Decorations";

type Partner = {
  name: string;
  color: string;
  note: string;
  parent?: string; // Optional: "By Tripadvisor Group" style credit
};

const PARTNERS: Partner[] = [
  { name: "Booking.com", color: "#003580", note: "Global inventory" },
  { name: "Expedia", color: "#FFC72C", note: "Bundle & save" },
  { name: "Hotels.com", color: "#D32F2F", note: "Rewards program" },
  {
    name: "Viator",
    color: "#328E68",
    note: "Tours & experiences",
    parent: "By Tripadvisor Group",
  },
];

export default function PartnerStrip() {
  return (
    <section
      aria-label="Our booking partners"
      className="relative -mt-1 border-b border-sea-100 bg-white/70 overflow-hidden rounded-b-2xl sm:rounded-b-3xl shadow-sm"
    >
      {/* Wave divider top */}
      <Wave className="absolute -top-3 left-0 w-full h-6 text-sea-300" />
      {/* Coral on the left, conch on the right — flanking partners */}
      <Coral className="hidden sm:block absolute -bottom-2 left-4 w-14 md:w-20 text-sea-400 opacity-60 pointer-events-none" />
      <Conch className="hidden sm:block absolute bottom-3 right-6 w-14 md:w-18 text-sea-500 opacity-60 -rotate-12 pointer-events-none" />
      {/* Pebble accents at edges */}
      <Pebble className="hidden md:block absolute bottom-2 left-32 w-16 text-sea-300 opacity-60 pointer-events-none" />
      <Pebble className="hidden md:block absolute bottom-2 right-32 w-16 text-sea-300 opacity-60 -scale-x-100 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 py-6 relative z-10">
        <div className="text-center text-xs uppercase tracking-widest text-slate-500 mb-4">
          Live inventory from trusted booking partners
        </div>

        <div className="flex flex-wrap items-end justify-center gap-x-5 sm:gap-x-8 gap-y-4">
          {PARTNERS.map((p) => (
            <div
              key={p.name}
              className="flex flex-col items-center text-center"
              title={p.parent ? `${p.name} — ${p.parent}` : p.note}
            >
              <span
                className="text-base sm:text-lg md:text-xl font-bold tracking-tight leading-none"
                style={{ color: p.color }}
              >
                {p.name}
              </span>
              {p.parent && (
                <span className="text-[9px] italic text-slate-500 mt-0.5">
                  {p.parent}
                </span>
              )}
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

        {/* Powered by line — subtle attribution below trust indicators */}
        <div className="mt-4 text-center text-[10px] uppercase tracking-widest text-slate-400">
          Reviews & experiences powered by <span className="font-semibold text-slate-500">Tripadvisor Group</span>
        </div>
      </div>
    </section>
  );
}
