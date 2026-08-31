import Image from "next/image";

// Slot → photo file + alt text. Slugs match the folder names inside public/guides/{slug}/.
// The MDX writes `<GuidePhoto slot="whenToGo" />` and this component resolves it.
const PHOTOS: Record<string, { file: string; alt: string }> = {
  hero:      { file: "hero.jpg",       alt: "Bangkok skyline at night with the Chao Phraya River in view" },
  whenToGo:  { file: "when-to-go.jpg", alt: "Songkran water festival celebration in the streets of Bangkok" },
  sukhumvit: { file: "sukhumvit.jpg",  alt: "BTS Skytrain running above Sukhumvit Road in Bangkok" },
  silom:     { file: "silom.jpg",      alt: "Rooftop bar overlooking Bangkok's Silom skyline at sunset" },
  riverside: { file: "riverside.jpg",  alt: "Longtail boat on the Chao Phraya River at dusk, Bangkok" },
  oldTown:   { file: "old-town.jpg",   alt: "Reclining Buddha statue at Wat Pho temple, Bangkok" },
  activity:  { file: "activity.jpg",   alt: "Wat Arun temple silhouetted against sunset across the Chao Phraya" },
  localTips: { file: "local-tips.jpg", alt: "Street food vendor cooking pad thai at a Bangkok night market" },
};

export default function GuidePhoto({
  slot,
  guideSlug = "bangkok",
}: {
  slot: string;
  guideSlug?: string;
}) {
  const meta = PHOTOS[slot];
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
