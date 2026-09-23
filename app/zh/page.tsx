// Chinese root page - reuses the same HomePage component.
// The LanguageProvider persists the /zh route choice via localStorage,
// so all client-rendered UI strings automatically switch to Chinese via useT().
// The Search Hotels widget, Where to Drift Next cards, and all typography
// are locale-aware by design - no separate homepage layout needed.
import HomePage from "@/app/page";

export const metadata = {
  title: "driftcoconut - 找到您的下一站住宿",
  description: "由本地人撰写的亚洲深度旅行指南 + 实时酒店比价预订。",
  alternates: {
    canonical: "/zh",
    languages: {
      en: "/",
      "zh-CN": "/zh",
      "x-default": "/",
    },
  },
  openGraph: {
    locale: "zh_CN",
  },
};

export default function HomePageZh() {
  return <HomePage />;
}
