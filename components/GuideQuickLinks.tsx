import Link from "next/link";
import { bookingCJSearch } from "@/lib/booking";

export default function GuideQuickLinks({ destination, locale }: { destination: string; locale: "en" | "zh" }) {
  const city = destination.split(",")[0].trim();
  const isZh = locale === "zh";

  return (
    <nav aria-label={isZh ? "行程下一步" : "Plan your next step"} className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-sea-100 bg-sea-50/70 p-4 text-sm">
      <span className="font-semibold text-sea-900">{isZh ? "计划这趟旅行" : "Planning this trip?"}</span>
      <a href={bookingCJSearch(city)} target="_blank" rel="sponsored noopener noreferrer" className="rounded-full bg-sea-700 px-4 py-2 font-semibold text-white hover:bg-sea-800">
        {isZh ? `查看${city}住宿 ↗` : `Find stays in ${city} ↗`}
      </a>
      <Link href={isZh ? "/zh/guides" : "/guides"} className="font-semibold text-sea-700 underline underline-offset-2 hover:text-sea-900">
        {isZh ? "浏览更多目的地 →" : "Explore more guides →"}
      </Link>
    </nav>
  );
}
