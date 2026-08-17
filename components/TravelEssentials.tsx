import { AFFILIATE_LINKS } from "@/lib/affiliateLinks";

type Essential = {
  key: keyof typeof AFFILIATE_LINKS;
  title: string;
  subtitle: string;
  emoji: string;
  color: string; // Tailwind text color class for the emoji circle
  bg: string;    // Tailwind bg color class for the icon circle
  hot?: boolean; // Highlight with "Hot" pill
};

// Row 1 — core essentials (original 4)
const ESSENTIALS_ROW1: Essential[] = [
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

// Row 2 — expansion partners
const ESSENTIALS_ROW2: Essential[] = [
  {
    key: "aviasales",
    title: "Flight meta-search",
    subtitle: "Scan 100+ airlines and OTAs in one search",
    emoji: "🛫",
    color: "text-rose-700",
    bg: "bg-rose-50",
    hot: true,
  },
  {
    key: "ekta",
    title: "Travel insurance",
    subtitle: "Medical, baggage, trip cancellation cover",
    emoji: "🛡️",
    color: "text-teal-700",
    bg: "bg-teal-50",
  },
  {
    key: "airhelp",
    title: "Flight delay refund",
    subtitle: "Claim up to €600 for delays or cancellations",
    emoji: "💸",
    color: "text-orange-700",
    bg: "bg-orange-50",
  },
];

function EssentialCard({ e }: { e: Essential }) {
  return (
    <a
      href={AFFILIATE_LINKS[e.key]}
      target="_blank"
      rel="noopener sponsored"
      className="group bg-white/80 backdrop-blur border border-sea-100 rounded-lg p-2.5 hover:border-sea-300 hover:shadow-sm transition-all flex flex-col relative"
    >
      {e.hot && (
        <div className="absolute top-1 right-1 text-[8px] uppercase tracking-wider text-rose-700 font-semibold bg-rose-50 px-1.5 py-[1px] rounded-full">
          Hot
        </div>
      )}
      <div className={`w-8 h-8 rounded-full ${e.bg} flex items-center justify-center text-base mb-1.5 flex-shrink-0`}>
        {e.emoji}
      </div>
      <h3 className={`font-display text-[13px] leading-tight font-semibold ${e.color} group-hover:text-sea-700 transition-colors`}>
        {e.title}
      </h3>
      <p className="text-[11px] leading-snug text-slate-600 mt-0.5">{e.subtitle}</p>
      <div className="mt-1.5 text-[11px] font-medium text-sea-700 inline-flex items-center gap-1">
        Book now
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
          <path d="M5 12h14" />
          <path d="M12 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  );
}

function AlternativeCard({
  href,
  emoji,
  bg,
  title,
  subtitle,
  titleColor,
}: {
  href: string;
  emoji: string;
  bg: string;
  title: string;
  subtitle: string;
  titleColor: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener sponsored"
      className="group bg-white/80 backdrop-blur border border-sea-100 rounded-lg p-2.5 hover:border-sea-300 hover:shadow-sm transition-all flex flex-col relative"
    >
      <div className="absolute top-1 right-1 text-[8px] uppercase tracking-wider text-sea-600 font-semibold bg-sea-50 px-1.5 py-[1px] rounded-full">
        Alt
      </div>
      <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center text-base mb-1.5 flex-shrink-0`}>
        {emoji}
      </div>
      <h3 className={`font-display text-[13px] leading-tight font-semibold ${titleColor} group-hover:text-sea-700 transition-colors`}>
        {title}
      </h3>
      <p className="text-[11px] leading-snug text-slate-600 mt-0.5">{subtitle}</p>
      <div className="mt-1.5 text-[11px] font-medium text-sea-700 inline-flex items-center gap-1">
        Book now
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
          <path d="M5 12h14" />
          <path d="M12 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  );
}

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
        <div className="text-center mb-4">
          <div className="text-[10px] uppercase tracking-widest text-sea-600 font-semibold">
            Travel essentials
          </div>
          <h2 className="font-display text-xl md:text-2xl font-semibold text-sea-800 mt-0.5">
            {heading}
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xl mx-auto">
            {subheading}
          </p>
        </div>
      )}

      {/* Row 1: core essentials — each column can stack an "Alternative" card underneath */}
      <div className={`grid gap-2 sm:gap-2.5 items-start ${compact ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"}`}>
        {ESSENTIALS_ROW1.map((e) => (
          <div key={e.key} className="flex flex-col gap-2">
            <EssentialCard e={e} />

            {/* Tiqets stacked under Klook — attraction tickets alternative */}
            {e.key === "klook" && (
              <AlternativeCard
                href={AFFILIATE_LINKS.tiqets}
                emoji="🎫"
                bg="bg-fuchsia-50"
                title="Tiqets attractions"
                subtitle="Museums, landmarks & skip-the-line tickets worldwide"
                titleColor="text-fuchsia-700"
              />
            )}

            {/* Drimsim + Airalo stacked under Yesim — connectivity alternatives */}
            {e.key === "yesim" && (
              <>
                <AlternativeCard
                  href={AFFILIATE_LINKS.drimsim}
                  emoji="📱"
                  bg="bg-sky-50"
                  title="Drimsim physical SIM"
                  subtitle="Prefer a physical SIM card? Works in 190+ countries"
                  titleColor="text-sky-700"
                />
                <AlternativeCard
                  href={AFFILIATE_LINKS.airalo}
                  emoji="🌐"
                  bg="bg-indigo-50"
                  title="Airalo global eSIM"
                  subtitle="200+ countries, install before you land"
                  titleColor="text-indigo-700"
                />
              </>
            )}
          </div>
        ))}
      </div>

      {/* Row 2: expansion partners (3 cards — Airalo moved into Yesim stack) */}
      <div className={`mt-2 sm:mt-2.5 grid gap-2 sm:gap-2.5 items-start ${compact ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3"}`}>
        {ESSENTIALS_ROW2.map((e) => (
          <EssentialCard key={e.key} e={e} />
        ))}
      </div>

      <p className="text-[9px] text-slate-400 mt-3 text-center italic">
        Affiliate disclosure: driftcoconut may earn a small commission when you book through these partners, at no extra cost to you.
      </p>
    </section>
  );
}
