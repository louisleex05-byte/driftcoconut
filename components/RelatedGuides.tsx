import Link from "next/link";
import Image from "next/image";
import { listGuides } from "@/lib/guides";
import { RELATED } from "@/lib/relatedGuides";

/** "Keep exploring" block: links a guide to its natural next-stop guides. */
export default async function RelatedGuides({
  slug,
  locale,
}: {
  slug: string;
  locale: "en" | "zh";
}) {
  const wanted = RELATED[slug] ?? [];
  if (wanted.length === 0) return null;

  const all = await listGuides(locale);
  const bySlug = new Map(all.map((g) => [g.slug, g]));
  const guides = wanted.map((s) => bySlug.get(s)).filter((g): g is NonNullable<typeof g> => !!g);
  if (guides.length === 0) return null;

  const prefix = locale === "zh" ? "/zh" : "";

  return (
    <section className="mt-12 pt-8 border-t border-sea-100" aria-labelledby="keep-exploring">
      <h2 id="keep-exploring" className="font-display text-xl font-semibold text-sea-800 mb-5">
        {locale === "zh" ? "继续探索" : "Keep exploring"}
      </h2>
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
