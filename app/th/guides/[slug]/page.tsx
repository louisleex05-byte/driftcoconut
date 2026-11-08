import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { bookingCJSearch } from "@/lib/booking";
import { getGuide, getGuideSlugs } from "@/lib/guides";
import AffiliateLink from "@/components/AffiliateLink";
import GuidePhoto, { GuidePhotoCredits } from "@/components/GuidePhoto";
import GuideQuickLinks from "@/components/GuideQuickLinks";
import RelatedGuides from "@/components/RelatedGuides";
import TripPlanner from "@/components/TripPlanner";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://driftcoconut.com").replace(/\/$/, "");
type Params = { slug: string };
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getGuideSlugs("th")).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuide(slug, "th");
  if (!guide) return { title: "ไม่พบคู่มือ" };
  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: `/th/guides/${slug}`,
      languages: {
        en: `/guides/${slug}`,
        th: `/th/guides/${slug}`,
        "zh-CN": `/zh/guides/${slug}`,
        "x-default": `/guides/${slug}`,
      },
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      images: guide.hero ? [{ url: guide.hero, alt: guide.heroAlt ?? guide.title }] : undefined,
      type: "article",
      locale: "th_TH",
      publishedTime: guide.publishDate,
      modifiedTime: guide.lastUpdated,
      authors: [guide.author],
    },
  };
}

export default async function ThaiGuidePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const guide = await getGuide(slug, "th");
  if (!guide) notFound();
  const BoundGuidePhoto = (props: { slot: string; caption?: string }) => (
    <GuidePhoto slot={props.slot} guideSlug={slug} caption={props.caption} />
  );
  const destination = guide.destination.replace(/\s*ประเทศไทย$/, "");
  const guideUrl = `${SITE_URL}/th/guides/${slug}`;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      mainEntityOfPage: guideUrl,
      datePublished: guide.publishDate,
      dateModified: guide.lastUpdated,
      inLanguage: "th-TH",
      author: { "@type": "Person", name: guide.author },
      publisher: { "@type": "Organization", name: "driftcoconut", url: SITE_URL },
      ...(guide.hero && { image: new URL(guide.hero, SITE_URL).toString() }),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "หน้าแรก", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "คู่มือเที่ยว", item: `${SITE_URL}/th/guides` },
        { "@type": "ListItem", position: 3, name: guide.destination, item: guideUrl },
      ],
    },
  ];

  return (
    <article lang="th" className="max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <nav className="text-xs text-slate-500 mb-6" aria-label="เส้นทางนำทาง">
        <Link href="/" className="hover:text-sea-600">หน้าแรก</Link>
        <span className="mx-1.5">·</span>
        <Link href="/th/guides" className="hover:text-sea-600">คู่มือเที่ยว</Link>
        <span className="mx-1.5">·</span>
        <span className="text-slate-700">{guide.destination}</span>
        <span className="mx-2">·</span>
        <Link href={`/guides/${slug}`} className="text-slate-400 hover:text-sea-600 italic">EN</Link>
      </nav>

      {guide.hero && (
        <div className="relative w-full aspect-[21/9] mb-8 rounded-2xl overflow-hidden shadow-lg">
          <Image src={guide.hero} alt={guide.heroAlt ?? guide.title} fill sizes="(max-width: 768px) 100vw, 768px" priority className="object-cover" />
        </div>
      )}

      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-sea-500 mb-2">คู่มือเที่ยว · {guide.destination}</p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-sea-800 leading-tight mb-3">{guide.title}</h1>
        <p className="text-sm text-slate-500">
          โดย <Link href="/about#author" className="hover:text-sea-600 underline underline-offset-2">{guide.author}</Link> · ปรับปรุง {new Date(guide.lastUpdated).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })} · อ่านประมาณ {guide.readingMinutes} นาที
        </p>
      </header>

      <GuideQuickLinks destination={destination} locale="th" />
      <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-sea-800 prose-a:text-sea-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-h2:mt-10 prose-h2:mb-4 prose-h3:mt-6 prose-h3:mb-2">
        <MDXRemote source={guide.content} components={{ AffiliateLink, GuidePhoto: BoundGuidePhoto }} />
      </div>
      <RelatedGuides slug={slug} locale="th" />
      <div className="mt-12 pt-8 border-t border-sea-100">
        <TripPlanner destination={destination} />
      </div>
      <div className="mt-12 pt-8 border-t border-sea-100">
        <div className="rounded-2xl bg-sea-50 border border-sea-100 p-6 sm:p-8 text-center">
          <p className="text-xs uppercase tracking-wide text-sea-500 mb-2">พร้อมจองที่พักหรือยัง?</p>
          <h2 className="font-display text-xl font-semibold text-sea-800 mb-3">ค้นหาที่พักใน{destination}</h2>
          <a href={bookingCJSearch(destination)} target="_blank" rel="sponsored noopener noreferrer" className="inline-block px-6 py-3 rounded-full bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors">ไปที่ Booking.com →</a>
        </div>
        <p className="mt-8 text-center text-xs text-slate-400"><Link href="/th/guides" className="hover:text-sea-600">← คู่มือเที่ยวทั้งหมด</Link></p>
      </div>
      <GuidePhotoCredits guideSlug={slug} content={guide.content} locale="th" />
    </article>
  );
}
