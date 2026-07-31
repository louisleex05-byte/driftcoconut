import Hero from "@/components/Hero";
import PartnerStrip from "@/components/PartnerStrip";
import { Hibiscus, Starfish, PalmLeaf, Boat, StrawHat, Coral, Conch, Shell } from "@/components/Decorations";

export default function HomePage() {
  return (
    <div className="space-y-10 relative">
      <Hero />
      <PartnerStrip />

      <section id="deals" className="relative py-6">
        {/* Decorative background elements — hibiscus, starfish, boat, conch */}
        <Hibiscus className="absolute -top-8 -right-2 w-20 md:w-28 text-sea-300 opacity-70 rotate-12 pointer-events-none" />
        <Starfish className="hidden sm:block absolute -bottom-4 -left-4 w-20 md:w-24 text-sea-400 opacity-70 -rotate-12 pointer-events-none" />
        <Boat className="hidden lg:block absolute top-2 left-8 w-24 text-sea-300 opacity-60 pointer-events-none" />
        <Conch className="hidden lg:block absolute -bottom-2 right-8 w-16 text-sea-400 opacity-60 pointer-events-none" />

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
            { title: "Tropical escapes", desc: "Bali, Phuket, Maldives", icon: <StrawHat className="w-10 h-10 text-sea-600" /> },
            { title: "City breaks", desc: "Tokyo, Singapore, HK", icon: <Boat className="w-10 h-10 text-sea-600" /> },
            { title: "Mountain retreats", desc: "Chiang Mai, Kyoto, Sapa", icon: <Coral className="w-10 h-10 text-sea-600" /> },
          ].map((c) => (
            <div
              key={c.title}
              className="relative bg-white/80 backdrop-blur rounded-xl border border-sea-100 p-6 hover:border-sea-300 hover:shadow-sm transition-all"
            >
              <div className="mb-2">{c.icon}</div>
              <h3 className="font-display text-lg font-semibold mt-2 text-sea-800">{c.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{c.desc}</p>
              {/* Faint decorative accent inside each card */}
              <Shell className="absolute bottom-3 right-3 w-10 text-sea-200 opacity-50 pointer-events-none" />
            </div>
          ))}
        </div>
      </section>

      {/* Ambient decorative palm leaf drifting in the page background — larger + more visible */}
      <PalmLeaf className="hidden lg:block fixed -bottom-20 -right-20 w-72 text-sea-200 opacity-60 rotate-45 pointer-events-none -z-10" />
      {/* Coral in the opposite corner for balance */}
      <Coral className="hidden lg:block fixed -bottom-16 -left-16 w-48 text-sea-200 opacity-50 -rotate-12 pointer-events-none -z-10" />
    </div>
  );
}
