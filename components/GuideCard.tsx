import Link from "next/link";
import Image from "next/image";
import type { GuideSummary } from "@/lib/guides";

/**
 * Shared guide-preview card — used on /guides, /zh/guides, and the homepage
 * "Featured guides" section so the three stay visually consistent.
 */
export default function GuideCard({
  guide,
  hrefPrefix = "",
}: {
  guide: GuideSummary;
  /** "" for English routes, "/zh" for the Chinese route tree. */
  hrefPrefix?: string;
}) {
  return (
    <Link
      href={`${hrefPrefix}/guides/${guide.slug}`}
      className="group rounded-2xl overflow-hidden border border-sea-100 bg-white hover:border-sea-300 hover:shadow-lg transition"
    >
      {guide.hero && (
        <div className="relative w-full aspect-[16/10] bg-sea-50 overflow-hidden">
          <Image
            src={guide.hero}
            alt={guide.heroAlt ?? guide.destination}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-5">
        <p className="text-xs uppercase tracking-wide text-sea-500 mb-1">{guide.destination}</p>
        <h2 className="font-display text-lg font-semibold text-sea-800 leading-snug mb-2">
          {guide.title}
        </h2>
        <p className="text-sm text-slate-600 line-clamp-3 mb-3">{guide.description}</p>
        <p className="text-xs text-slate-400">
          {guide.author} · {guide.readingMinutes} min read
        </p>
      </div>
    </Link>
  );
}
