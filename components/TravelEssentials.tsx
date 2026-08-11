import { AFFILIATE_LINKS } from "@/lib/affiliateLinks";

type Essential = {
  key: keyof typeof AFFILIATE_LINKS;
  title: string;
  subtitle: string;
  emoji: string;
  color: string; // Tailwind text color class for the emoji circle
  bg: string;    // Tailwind bg color class for the icon circle
};

const ESSENTIALS: Essential[] = [
  {
    key: "klook",
    title: "Book tours & experiences",
    subtitle: "Skip-the-line tickets, cooking classes, day trips",
    emoji: "🎟️",
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
  {
    key: "welcomePickups",
    title: "Airport transfer",
    subtitle: "Meet-and-greet, English-speaking drivers",
    emoji: "🚕",
    color: "text-sea-700",
    bg: "bg-sea-50",
  },
  {
    key: "yesim",
    title: "Local eSIM data",
    subtitle: "Stay connected from the moment you land",
    emoji: "📶",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  {
    key: "kiwi",
    title: "Compare flights",
    subtitle: "Multi-airline routes, hidden-city fares",
    emoji: "✈️",
    color: "text-slate-700",
    bg: "bg-slate-100",
  },
];

export default function TravelEssentials({
  compact = false,
  heading = "Complete your trip",
  subheading = "Everything you need before you leave — curated partners we trust.",
}: {
  compact?: boolean;
  heading?: string;
  subheading?: string;
}) {
  return (
    <section aria-label="Travel essentials" className="relative">
      {!compact && (
        <div className="text-center mb-6">
          <div className="text-xs uppercase tracking-widest text-sea-600 font-semibold">
            Travel essentials
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-sea-800 mt-1">
            {heading}
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
            {subheading}
          </p>
        </div>
      )}

      <div className={`grid gap-3 sm:gap-4 ${compact ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}>
        {ESSENTIALS.map((e) => (
          <a
            key={e.key}
            href={AFFILIATE_LINKS[e.key]}
            target="_blank"
            rel="noopener sponsored"
            className="group bg-white/80 backdrop-blur border border-sea-100 rounded-xl p-4 hover:border-sea-300 hover:shadow-sm transition-all flex flex-col"
          >
            <div className={`w-11 h-11 rounded-full ${e.bg} flex items-center justify-center text-2xl mb-3 flex-shrink-0`}>
              {e.emoji}
            </div>
            <h3 className={`font-display text-base font-semibold ${e.color} group-hover:text-sea-700 transition-colors`}>
              {e.title}
            </h3>
            <p className="text-xs text-slate-600 mt-1 flex-grow">{e.subtitle}</p>
            <div className="mt-3 text-xs font-medium text-sea-700 inline-flex items-center gap-1">
              Book now
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        ))}
      </div>

      <p className="text-[10px] text-slate-400 mt-4 text-center italic">
        Affiliate disclosure: driftcoconut may earn a small commission when you book through these partners, at no extra cost to you.
      </p>
    </section>
  );
}
