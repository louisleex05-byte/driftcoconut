// Chinese root page - reuses the same HomePage component.
// The LanguageProvider persists the /zh route choice via localStorage,
// so all client-rendered UI strings automatically switch to Chinese via useT().
// The Search Hotels widget, Where to Drift Next cards, and all typography
// are locale-aware by design - no separate homepage layout needed.
import HomePage from "@/app/page";

export const metadata = {
  title: "driftcoconut - 亚洲旅行指南与住宿推荐",
  description: "真诚的本地亚洲旅行指南和街区攻略，先知道住哪里，再通过 Booking.com 预订。",
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
