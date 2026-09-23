import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { listGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "目的地指南",
  description: "由本地人撰写的深度旅行指南 - 专注亚洲最好的目的地。",
  alternates: {
    canonical: "/zh/guides",
    languages: {
      en: "/guides",
      "zh-CN": "/zh/guides",
      "x-default": "/guides",
    },
  },
  openGraph: {
    locale: "zh_CN",
  },
};

export default async function GuidesIndexPageZh() {
  const guides = await listGuides("zh");

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-10 sm:mb-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-sea-500 mb-2">
          指南小贴士
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-sea-800 mb-3">
          目的地指南
        </h1>
        <p className="text-slate-600 max-w-2xl leading-relaxed">
          由本地人撰写、观点鲜明、具体实用 — 住哪里、什么时候去、真正重要的是什么。
          不是抓取拼凑的内容,是真实的经验。
        </p>
      </header>

      {guides.length === 0 ? (
        <p className="text-slate-500">暂无发布的指南。</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <Link
              key={g.slug}
              href={`/zh/guides/${g.slug}`}
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
                  {g.author} · 阅读时间 {g.readingMinutes} 分钟
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
