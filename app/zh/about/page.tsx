// Chinese About page - reuses AboutContent. The LanguageProvider switches the UI to
// Chinese automatically for any /zh/... path, so the same component renders the
// Chinese copy from lib/i18n.ts. Exists so the language toggle can land on /zh/about
// instead of a 404.
import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";

export const metadata: Metadata = {
  title: "关于我们",
  description: "driftcoconut 是一个独立的亚洲旅行指南网站:指南如何制作、我们如何赚钱,以及我们的合作伙伴。",
  alternates: {
    canonical: "/zh/about",
    languages: {
      en: "/about",
      "zh-CN": "/zh/about",
      "x-default": "/about",
    },
  },
  openGraph: {
    locale: "zh_CN",
  },
};

export default function AboutPageZh() {
  return <AboutContent />;
}
