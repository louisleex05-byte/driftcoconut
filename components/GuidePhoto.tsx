import Image from "next/image";

// Per-guide slot → photo file + alt text.
// The MDX writes `<GuidePhoto slot="whenToGo" />` — this resolves the slot for the
// current guideSlug (defaulting to bangkok for backwards-compat).
//
// To add photos for a new guide: add a new entry keyed by that guide's slug, with
// slot names matching the <GuidePhoto slot="..." /> tags used in its MDX.

type PhotoEntry = { file: string; alt: string };

const GUIDES: Record<string, Record<string, PhotoEntry>> = {
  bangkok: {
    hero:      { file: "hero.jpg",       alt: "Bangkok skyline at night with the Chao Phraya River in view" },
    whenToGo:  { file: "when-to-go.jpg", alt: "Songkran water festival celebration in the streets of Bangkok" },
    sukhumvit: { file: "sukhumvit.jpg",  alt: "BTS Skytrain running above Sukhumvit Road in Bangkok" },
    silom:     { file: "silom.jpg",      alt: "Rooftop bar overlooking Bangkok's Silom skyline at sunset" },
    riverside: { file: "riverside.jpg",  alt: "Longtail boat on the Chao Phraya River at dusk, Bangkok" },
    oldTown:   { file: "old-town.jpg",   alt: "Reclining Buddha statue at Wat Pho temple, Bangkok" },
    activity:  { file: "activity.jpg",   alt: "Wat Arun temple silhouetted against sunset across the Chao Phraya" },
    localTips: { file: "local-tips.jpg", alt: "Street food vendor cooking pad thai at a Bangkok night market" },
  },
  "chiang-mai": {
    hero:        { file: "hero.jpg",         alt: "Doi Suthep golden temple overlooking Chiang Mai city at sunset" },
    whenToGo:    { file: "when-to-go.jpg",   alt: "Yi Peng lantern festival releasing sky lanterns over Chiang Mai" },
    oldCity:     { file: "old-city.jpg",     alt: "Chiang Mai Old City ancient moat and city wall" },
    nimman:      { file: "nimman.jpg",       alt: "Nimman coffee shop and cafe district in Chiang Mai" },
    riverside:   { file: "riverside.jpg",    alt: "Ping River teak houses at sunset in Chiang Mai" },
    nightBazaar: { file: "night-bazaar.jpg", alt: "Chiang Mai Night Bazaar and Anusarn Market stalls at night" },
    santitham:   { file: "santitham.jpg",    alt: "Santitham local Thai residential neighborhood in Chiang Mai" },
    doiSuthep:   { file: "doi-suthep.jpg",   alt: "Wat Phra That Doi Suthep temple with mountain view" },
    khaoSoi:     { file: "khao-soi.jpg",     alt: "Bowl of Northern Thai khao soi curry noodles in Chiang Mai" },
  },
};

export default function GuidePhoto({
  slot,
  guideSlug = "bangkok",
}: {
  slot: string;
  guideSlug?: string;
}) {
  const guide = GUIDES[guideSlug] ?? GUIDES.bangkok;
  const meta = guide[slot];
  if (!meta) return null;
  return (
    <figure className="my-8 not-prose">
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-md">
        <Image
          src={`/guides/${guideSlug}/${meta.file}`}
          alt={meta.alt}
          fill
          sizes="(max-width: 768px) 100vw, 720px"
          className="object-cover"
        />
      </div>
      <figcaption className="mt-2 text-xs text-slate-500 italic">{meta.alt}</figcaption>
    </figure>
  );
}
