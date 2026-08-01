import Hero from "@/components/Hero";
import PartnerStrip from "@/components/PartnerStrip";
import SearchForm from "@/components/SearchForm";
import { Hibiscus, Starfish, PalmLeaf, Boat, StrawHat, Coral, Conch, Shell } from "@/components/Decorations";

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero + PartnerStrip visually attached — no gap between them */}
      <div className="mb-10">
        <Hero />
        <PartnerStrip />
      </div>

      {/* Main search form — its own section, anchored for the header search icon */}
      <section id="search-form" className="mb-10 scroll-mt-24">
        <div className="text-center mb-4">
          <div className="text-xs uppercase tracking-widest text-sea-600 font-semibold">
            Where to?
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-sea-800 mt-1">
            Search hotels
          </h2>
        </div>
        <SearchForm />
      </section>

      {/* Between-sections dispersed decorations */}
      <div className="relative h-6 -my-2">
        <Boat className="hidden md:block absolute -top-4 left-1/4 w-16 text-sea-400 opacity-55 pointer-events-none" />
        <StrawHat className="hidden md:block absolute -top-3 right-1/3 w-14 text-sea-400 opacity-55 pointer-events-none rotate-6" />
        <Conch className="hidden lg:block absolute -top-2 left-2/3 w-10 text-sea-500 opacity-55 pointer-events-none -rotate-12" />
      </div>

      <section id="deals" className="relative py-6 mb-10">
        <Hibiscus className="absolute -top-6 -right-2 w-20 md:w-28 text-sea-300 opacity-70 rotate-12 pointer-events-none" />
        <Starfish className="hidden sm:block absolute -bottom-4 -left-4 w-20 md:w-24 text-sea-400 opacity-70 -rotate-12 pointer-events-none" />

        <div className="text-center mb-6 relative">
          <div className="text-xs uppercase tracking-widest text-sea-600 font-semibold">
            Curated for wanderers
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-sea-800 mt-1">
            Where to drift next
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 relative z-10">
          {[
            { title: "Tropical escapes", desc: "Bali, Phuket, Maldives", emoji: "🏝️" },
            { title: "City breaks", desc: "Tokyo, Singapore, HK", emoji: "🏙️" },
            { title: "Mountain retreats", desc: "Chiang Mai, Kyoto, Sapa", emoji: "⛰️" },
          ].map((c) => (
            <div
              key={c.title}
              className="relative bg-white/80 backdrop-blur rounded-xl border border-sea-100 p-6 hover:border-sea-300 hover:shadow-sm transition-all"
            >
              <div className="text-3xl">{c.emoji}</div>
              <h3 className="font-display text-lg font-semibold mt-2 text-sea-800">{c.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{c.desc}</p>
              {c.title === "Tropical escapes" && (
                <Shell className="absolute bottom-3 right-3 w-10 text-sea-200 opacity-60 pointer-events-none" />
              )}
              {c.title === "City breaks" && (
                <Conch className="absolute bottom-3 right-3 w-10 text-sea-200 opacity-60 pointer-events-none" />
              )}
              {c.title === "Mountain retreats" && (
                <Starfish className="absolute bottom-3 right-3 w-10 text-sea-200 opacity-60 pointer-events-none" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Below-deals dispersed accents */}
      <div className="relative h-8">
        <Coral className="hidden sm:block absolute top-0 left-6 w-14 text-sea-400 opacity-50 pointer-events-none" />
        <StrawHat className="hidden md:block absolute top-2 left-1/2 -translate-x-1/2 w-16 text-sea-300 opacity-55 pointer-events-none -rotate-6" />
        <Boat className="hidden sm:block absolute top-1 right-6 w-16 text-sea-400 opacity-55 pointer-events-none" />
      </div>

      {/* Ambient palm leaf + coral drifting in the page corners */}
      <PalmLeaf className="hidden lg:block fixed -bottom-20 -right-20 w-72 text-sea-200 opacity-60 rotate-45 pointer-events-none -z-10" />
      <Coral className="hidden lg:block fixed top-1/3 -left-10 w-40 text-sea-200 opacity-45 -rotate-6 pointer-events-none -z-10" />
    </div>
  );
}
