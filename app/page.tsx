import Hero from "@/components/Hero";
import PartnerStrip from "@/components/PartnerStrip";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <Hero />
      <PartnerStrip />

      <section id="deals" className="grid md:grid-cols-3 gap-4">
        {[
          { title: "Tropical escapes", desc: "Bali, Phuket, Maldives", emoji: "🏝️" },
          { title: "City breaks", desc: "Tokyo, Singapore, HK", emoji: "🏙️" },
          { title: "Mountain retreats", desc: "Chiang Mai, Kyoto, Sapa", emoji: "⛰️" },
        ].map((c) => (
          <div key={c.title} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="text-3xl">{c.emoji}</div>
            <h3 className="font-semibold mt-2">{c.title}</h3>
            <p className="text-sm text-slate-600">{c.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
