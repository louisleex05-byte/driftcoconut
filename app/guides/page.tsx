import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { listGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Destination guides",
  description: "In-depth, locally-written travel guides for Asia's best destinations.",
};

export default async function GuidesIndexPage() {
  const guides = await listGuides();

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-10 sm:mb-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-sea-500 mb-2">
          Guide tips
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-sea-800 mb-3">
          Destination guides
        </h1>
        <p className="text-slate-600 max-w-2xl leading-relaxed">
          Locally written, opinionated, and specific — where to stay, when to visit, what
          actually matters. Not scraped. Not stitched together.
        </p>
      </header>

      {guides.length === 0 ? (
        <p className="text-slate-500">No guides published yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="group rounded-2xl overflow-hidden border border-sea-100 bg-white hover:border-sea-300 hover:shadow-lg transition"
            >
              {g.hero && (
                <div className="relative w-full aspect-[16/10] bg-sea-50 overflow-hidden">
                  <Image
                    src={g.hero}
                    alt={g.heroAlt ?? g.destination}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-5">
                <p className="text-xs uppercase tracking-wide text-sea-500 mb-1">
                  {g.destination}
                </p>
                <h2 className="font-display text-lg font-semibold text-sea-800 leading-snug mb-2">
                  {g.title}
                </h2>
                <p className="text-sm text-slate-600 line-clamp-3 mb-3">{g.description}</p>
                <p className="text-xs text-slate-400">
                  {g.author} · {g.readingMinutes} min read
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
