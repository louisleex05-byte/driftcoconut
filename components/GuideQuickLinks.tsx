import Link from "next/link";
import { bookingCJSearch } from "@/lib/booking";

export default function GuideQuickLinks({ destination, locale }: { destination: string; locale: "en" | "zh" | "th" }) {
  const city = destination.split(",")[0].trim();
  const isZh = locale === "zh";

  return (
    <nav aria-label={isZh ? "行程下一步" : locale === "th" ? "วางแผนขั้นต่อไป" : "Plan your next step"} className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-sea-100 bg-sea-50/70 p-4 text-sm">
      <span className="font-semibold text-sea-900">{isZh ? "计划这趟旅行" : locale === "th" ? "กำลังวางแผนเที่ยวอยู่ใช่ไหม?" : "Planning this trip?"}</span>
      <a
        href={bookingCJSearch(city)}
        target="_blank"
        rel="sponsored noopener noreferrer"
        data-affiliate-partner="booking"
        data-affiliate-query={city}
        data-affiliate-placement="guide_quick_links"
        className="rounded-full bg-sea-700 px-4 py-2 font-semibold text-white hover:bg-sea-800"
      >
        {isZh ? `查看${city}住宿 ↗` : locale === "th" ? `ค้นหาที่พักใน${city} ↗` : `Find stays in ${city} ↗`}
      </a>
      <Link href={isZh ? "/zh/guides" : locale === "th" ? "/th/guides" : "/guides"} className="font-semibold text-sea-700 underline underline-offset-2 hover:text-sea-900">
        {isZh ? "浏览更多目的地 →" : locale === "th" ? "ดูคู่มือเที่ยวอื่น ๆ →" : "Explore more guides →"}
      </Link>
    </nav>
  );
}
