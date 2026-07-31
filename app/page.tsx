import Hero from "@/components/Hero";
import PartnerStrip from "@/components/PartnerStrip";
import { Hibiscus, Starfish, PalmLeaf } from "@/components/Decorations";

export default function HomePage() {
  return (
    <div className="space-y-10 relative">
      <Hero />
      <PartnerStrip />

      <section id="deals" className="relative">
        {/* Decorative hibiscus & starfish in the background of the deals block */}
        <Hibiscus className="hidden md:block absolute -top-6 -right-4 w-24 text-sea-200 opacity-50 rotate-12 pointer-events-none" />
        <Starfish className="hidden md:block absolute -bottom-6 -left-4 w-20 text-sand-100 opacity-70 -rotate-12 pointer-events-none" />

        <div className="text-center mb-6">
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
              className="bg-white/80 backdrop-blur rounded-xl border border-sea-100 p-6 hover:border-sea-300 hover:shadow-sm transition-all"
            >
              <div className="text-3xl">{c.emoji}</div>
              <h3 className="font-display text-lg font-semibold mt-2 text-sea-800">{c.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ambient decorative palm leaf drifting in the page background */}
      <PalmLeaf className="hidden lg:block fixed -bottom-16 -right-16 w-64 text-sea-100 opacity-40 rotate-45 pointer-events-none -z-10" />
    </div>
  );
}
