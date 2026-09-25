import type { Metadata } from "next";
import { listGuides } from "@/lib/guides";
import GuideCard from "@/components/GuideCard";

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
            <GuideCard key={g.slug} guide={g} />
          ))}
        </div>
      )}
    </div>
  );
}
