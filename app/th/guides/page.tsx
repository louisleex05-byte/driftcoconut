import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { listGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "คู่มือเที่ยวประเทศไทยภาษาไทย",
  description: "คู่มือเที่ยวเขาใหญ่ เขาค้อ เชียงราย น่าน และแม่ฮ่องสอน พร้อมคำแนะนำเรื่องที่พัก ช่วงเวลาเที่ยว กิจกรรม และการเดินทาง",
  alternates: { canonical: "/th/guides" },
  openGraph: { locale: "th_TH" },
};

export default async function ThaiGuidesIndexPage() {
  const guides = await listGuides("th");
  return (
    <div lang="th" className="max-w-5xl mx-auto">
      <header className="mb-10 sm:mb-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-sea-500 mb-2">วางแผนการเดินทาง</p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-sea-800 mb-3">คู่มือเที่ยวภาษาไทย</h1>
        <p className="text-slate-600 max-w-2xl leading-relaxed">เลือกจุดหมายและดูข้อมูลที่พัก ช่วงเวลาเที่ยว กิจกรรม และการเดินทางก่อนออกทริป</p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <Link key={guide.slug} href={`/th/guides/${guide.slug}`} className="group rounded-2xl overflow-hidden border border-sea-100 bg-white hover:border-sea-300 hover:shadow-lg transition">
            {guide.hero && (
              <div className="relative w-full aspect-[16/10] bg-sea-50 overflow-hidden">
                <Image src={guide.hero} alt={guide.heroAlt ?? guide.destination} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            )}
            <div className="p-5">
              <p className="text-xs uppercase tracking-wide text-sea-500 mb-1">{guide.destination}</p>
              <h2 className="font-display text-lg font-semibold text-sea-800 leading-snug mb-2">{guide.title}</h2>
              <p className="text-sm text-slate-600 line-clamp-3 mb-3">{guide.description}</p>
              <p className="text-xs text-slate-400">{guide.author} · อ่านประมาณ {guide.readingMinutes} นาที</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
