import type { Metadata } from "next";
import { listGuides } from "@/lib/guides";
import GuideCard from "@/components/GuideCard";

export const metadata: Metadata = {
  title: "Destination guides",
  description: "In-depth, locally-written travel guides for Asia's best destinations.",
};

// Always show these three guides in the first row, in this order.
const PINNED_SLUGS = ["bangkok", "pattaya", "chiang-mai"];

export default async function GuidesIndexPage() {
  const all = await listGuides();

  // Pin the top-row guides first, then append the rest in their normal order.
  const pinned = PINNED_SLUGS
    .map((s) => all.find((g) => g.slug === s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));
  const rest = all.filter((g) => !PINNED_SLUGS.includes(g.slug));
  const guides = [...pinned, ...rest];

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
            <GuideCard key={g.slug} guide={g} />
          ))}
        </div>
      )}
    </div>
  );
}
