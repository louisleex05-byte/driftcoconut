import { listGuides } from "@/lib/guides";
import HomeClient from "@/components/HomeClient";

// Server component so listGuides() (fs-based) can run at request/build time.
// All interactive/translated UI lives in HomeClient; we just hand it real
// guide data for the "Featured guides" homepage-funnel section.
//
// This route ("/") serves EN/TH/ZH all from the same URL — the language
// toggle switches UI copy client-side rather than routing to /zh. So we fetch
// BOTH locale variants of the featured guides here and let FeaturedGuides
// (client-side, locale-aware) pick the right one at render time — otherwise
// toggling to Chinese would leave the guide cards themselves stuck in English.
export default async function HomePage() {
  const [guidesEn, guidesZh] = await Promise.all([listGuides("en"), listGuides("zh")]);
  const featuredEn = guidesEn.slice(0, 3);
  const featuredSlugs = new Set(featuredEn.map((g) => g.slug));
  const featuredZh = guidesZh.filter((g) => featuredSlugs.has(g.slug));
  return <HomeClient guidesEn={featuredEn} guidesZh={featuredZh} />;
}
