import Link from "next/link";
import Image from "next/image";
import { listGuides } from "@/lib/guides";
import { RELATED } from "@/lib/relatedGuides";

/** Photo cards shown beneath each guide's related-destinations section. */
export default async function RelatedGuides({
  slug,
  locale,
}: {
  slug: string;
  locale: "en" | "zh" | "th";
}) {
  const all = await listGuides(locale);
  const bySlug = new Map(all.map((g) => [g.slug, g]));
  const wanted = RELATED[slug] ?? [];
  const guides = wanted.map((s) => bySlug.get(s)).filter((g): g is NonNullable<typeof g> => !!g);
  const country = bySlug.get(slug)?.destination.split(",").at(-1)?.trim();
  for (const guide of all) {
    if (guides.length >= 3) break;
    if (guide.slug !== slug && !guides.some((g) => g.slug === guide.slug) && (locale === "th" || (country && guide.destination.endsWith(country)))) {
      guides.push(guide);
    }
  }
  if (guides.length === 0) return null;

  const prefix = locale === "zh" ? "/zh" : locale === "th" ? "/th" : "";

  return (
    <section id="related-destination-cards" className="mt-6" aria-label={locale === "zh" ? "相关目的地指南" : locale === "th" ? "คู่มือจุดหมายใกล้เคียง" : "Related destination guides"}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`${prefix}/guides/${g.slug}`}
            className="group rounded-xl overflow-hidden border border-sea-100 bg-white hover:border-sea-300 hover:shadow-md transition"
          >
            {g.hero && (
              <div className="relative w-full aspect-[16/9] bg-sea-50 overflow-hidden">
                <Image
                  src={g.hero}
                  alt={g.heroAlt ?? g.destination}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className="p-4">
              {g === guides[0] && <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-coral-600">{locale === "zh" ? "推荐下一站" : locale === "th" ? "จุดหมายถัดไป" : "Next destination"}</p>}
              <p className="text-xs uppercase tracking-wide text-sea-500 mb-1">{g.destination}</p>
              <p className="font-display text-base font-semibold text-sea-800 leading-snug">
                {g.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
