import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { bookingCJSearch } from "@/lib/booking";
import { getGuide, getGuideSlugs } from "@/lib/guides";
import AffiliateLink from "@/components/AffiliateLink";
import GuidePhoto from "@/components/GuidePhoto";

// Statically generate all guide slugs at build time.
export async function generateStaticParams() {
  const slugs = await getGuideSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuide(slug);
  if (!guide) return { title: "Guide not found" };
  return {
    title: guide.title,
    description: guide.description,
    openGraph: {
      title: guide.title,
      description: guide.description,
      images: guide.hero ? [{ url: guide.hero, alt: guide.heroAlt ?? guide.title }] : undefined,
      type: "article",
      publishedTime: guide.publishDate,
      modifiedTime: guide.lastUpdated,
      authors: [guide.author],
    },
  };
}

// Components made available inside MDX.
const mdxComponents = {
  AffiliateLink,
  GuidePhoto,
};

export default async function GuidePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const guide = await getGuide(slug);
  if (!guide) notFound();

  return (
    <article className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-sea-600">Home</Link>
        <span className="mx-1.5">·</span>
        <Link href="/guides" className="hover:text-sea-600">Guides</Link>
        <span className="mx-1.5">·</span>
        <span className="text-slate-700">{guide.destination}</span>
      </nav>

      {/* Hero image */}
      {guide.hero && (
        <div className="relative w-full aspect-[21/9] mb-8 rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={guide.hero}
            alt={guide.heroAlt ?? guide.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            className="object-cover"
          />
        </div>
      )}

      {/* Title block */}
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-sea-500 mb-2">
          Guide · {guide.destination}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-sea-800 leading-tight mb-3">
          {guide.title}
        </h1>
        <p className="text-sm text-slate-500">
          By {guide.author} · Updated {formatDate(guide.lastUpdated)} · {guide.readingMinutes} min read
        </p>
      </header>

      {/* Guide body */}
      <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-sea-800 prose-a:text-sea-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-h2:mt-10 prose-h2:mb-4 prose-h3:mt-6 prose-h3:mb-2">
        <MDXRemote source={guide.content} components={mdxComponents} />
      </div>

      {/* Footer CTA */}
      <div className="mt-12 pt-8 border-t border-sea-100">
        <div className="rounded-2xl bg-sea-50 border border-sea-100 p-6 sm:p-8 text-center">
          <p className="text-xs uppercase tracking-wide text-sea-500 mb-2">Ready to book?</p>
          <h2 className="font-display text-xl font-semibold text-sea-800 mb-3">
            Search hotels in {guide.destination.split(",")[0]}
          </h2>
          <a
            href={bookingCJSearch(guide.destination.split(",")[0])}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="inline-block px-6 py-3 rounded-full bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors"
          >
            Browse on Booking.com →
          </a>
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          <Link href="/guides" className="hover:text-sea-600">← All destination guides</Link>
        </p>
      </div>
    </article>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
