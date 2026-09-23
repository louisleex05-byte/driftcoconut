// Trust strip shown under the hero.
//
// STRIPPED DOWN to only actively-approved affiliate partners. Showing partner
// logos we haven't signed with (Expedia, Hotels.com, Viator) implied
// partnerships that don't exist - a soft FTC / Google trust risk and a
// commission leak (users clicking those logos left the site without
// attribution).
//
// Currently active: Booking.com CJ affiliate (publisher 101849416, approved
// 14-May-2026, 4% lead commission). Add Agoda / Trip.com here ONLY after
// approval so every logo maps to real earnings.

import { Wave, Pebble, Coral, Conch } from "./Decorations";

type Partner = {
  name: string;
  color: string;
  note: string;
};

const PARTNERS: Partner[] = [
  { name: "Booking.com", color: "#003580", note: "2.3M+ properties worldwide" },
];

export default function PartnerStrip() {
  return (
    <section
      aria-label="Our booking partner"
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
          Live inventory from our trusted booking partner
        </div>

        <div className="flex flex-wrap items-end justify-center gap-x-5 sm:gap-x-8 gap-y-4">
          {PARTNERS.map((p) => (
            <div
              key={p.name}
              className="flex flex-col items-center text-center"
              title={p.note}
            >
              <span
                className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-none"
                style={{ color: p.color }}
              >
                {p.name}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">
                {p.note}
              </span>
            </div>
          ))}
        </div>

        {/* Trust indicators — all four apply to Booking.com's own guarantees */}
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
