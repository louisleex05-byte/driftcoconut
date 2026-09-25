import { listGuides } from "@/lib/guides";
import HomeClient from "@/components/HomeClient";

// Server component so listGuides() (fs-based) can run at request/build time.
// All interactive/translated UI lives in HomeClient; we just hand it real
// guide data for the "Featured guides" homepage-funnel section.
export default async function HomePage() {
  const guides = await listGuides();
  const featured = guides.slice(0, 3);
  return <HomeClient guides={featured} />;
}
