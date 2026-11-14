import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";

export const TRAVEL_ESSENTIALS_PATHS = {
  en: "/travel-essentials",
  th: "/th/travel-essentials",
  zh: "/zh/travel-essentials",
} satisfies Record<Locale, string>;

export const TRAVEL_ESSENTIALS_ALTERNATES = {
  en: TRAVEL_ESSENTIALS_PATHS.en,
  th: TRAVEL_ESSENTIALS_PATHS.th,
  "zh-CN": TRAVEL_ESSENTIALS_PATHS.zh,
  "x-default": TRAVEL_ESSENTIALS_PATHS.en,
};

export const TRAVEL_ESSENTIALS_LANG = { en: "en", th: "th", zh: "zh-CN" };

const englishCopy = {
  title: "Travel essentials for Thailand",
  description: "Find practical travel essentials for Thailand, from backpacks and power banks to packing organizers and waterproof phone cases.",
  eyebrow: "Travel essentials",
  heading: "Practical picks for smoother Thailand trips",
  introduction: "A small, carefully reviewed collection for packing, charging, and looking after your kit on the road.",
  affiliateLink: "Shopee affiliate link",
  underReview: "Under review",
  preparingLink: "Link being prepared",
  retailer: "Shopee Thailand",
  price: "Price checked",
  demand: "Demand",
  rating: "Listing signal",
  observed: (date: string) => `Observed ${date}. Price, stock, and availability can change.`,
  shop: "View on Shopee",
  comingSoon: "Affiliate link coming soon",
  shopProduct: (name: string) => `View ${name} on Shopee`,
  outdoorTitle: "Planning an outdoor trip?",
  outdoorDescription: "For camping and nature-focused travel, explore the wider gear collection at LezzCamp.",
  outdoorLink: "Explore LezzCamp gear",
  guidesTitle: "More Thailand planning help",
  guidesDescription: "Pair your essentials with practical destination advice before you go.",
  guidesLink: "Browse destination guides",
  noteTitle: "Note",
  note: "We may earn a commission from purchases made through affiliate links, at no extra cost to you. Check Shopee for current prices and availability.",
};

export const TRAVEL_ESSENTIALS_COPY = {
  en: englishCopy,
  th: {
    title: "ของใช้จำเป็นสำหรับเที่ยวไทย",
    description: "เลือกของใช้สำหรับเที่ยวไทย ทั้งกระเป๋าเป้ พาวเวอร์แบงก์ ถุงจัดกระเป๋า และซองกันน้ำสำหรับโทรศัพท์",
    eyebrow: "ของใช้เดินทาง",
    heading: "อุปกรณ์ช่วยให้เที่ยวไทยแบบสบายๆ",
    introduction: "รวมของใช้ที่เราคัดมาให้สำหรับจัดกระเป๋า ชาร์จอุปกรณ์ และดูแลสัมภาระระหว่างเดินทาง",
    affiliateLink: "ลิงก์แนะนำสินค้าจาก Shopee",
    underReview: "กำลังตรวจสอบสินค้า",
    preparingLink: "กำลังเตรียมลิงก์",
    retailer: "Shopee ประเทศไทย",
    price: "ราคาที่ตรวจสอบ",
    demand: "ยอดขาย",
    rating: "คะแนนจากผู้ซื้อ",
    observed: (date: string) => `ตรวจสอบเมื่อ ${date} ราคาและจำนวนสินค้าอาจเปลี่ยนแปลง`,
    shop: "ดูสินค้าบน Shopee",
    comingSoon: "ลิงก์สินค้าจะพร้อมใช้งานเร็ว ๆ นี้",
    shopProduct: (name: string) => `ดู ${name} บน Shopee`,
    outdoorTitle: "กำลังวางแผนเที่ยวธรรมชาติ?",
    outdoorDescription: "ดูอุปกรณ์สำหรับตั้งแคมป์และเที่ยวธรรมชาติเพิ่มเติมได้ที่ LezzCamp",
    outdoorLink: "ดูอุปกรณ์จาก LezzCamp",
    guidesTitle: "ตัวช่วยวางแผนเที่ยวไทย",
    guidesDescription: "เมื่อเตรียมของพร้อมแล้ว ลองอ่านคำแนะนำเกี่ยวกับจุดหมายก่อนออกเดินทาง",
    guidesLink: "ดูคู่มือท่องเที่ยว",
    noteTitle: "หมายเหตุ",
    note: "เราอาจได้รับค่าคอมมิชชันเมื่อคุณซื้อสินค้าผ่านลิงก์แนะนำ โดยคุณไม่ต้องจ่ายเพิ่ม โปรดตรวจสอบราคาและสถานะสินค้าล่าสุดบน Shopee",
  },
  zh: {
    title: "泰国旅行必备好物",
    description: "挑选适合泰国旅行的实用装备，包括背包、充电宝、压缩收纳袋和手机防水套。",
    eyebrow: "旅行必备好物",
    heading: "让泰国之旅更轻松的实用装备",
    introduction: "我们精选了几款实用装备，帮你整理行李、为设备充电，并保护旅途中的随身物品。",
    affiliateLink: "Shopee 联盟推广链接",
    underReview: "商品审核中",
    preparingLink: "链接准备中",
    retailer: "Shopee 泰国站",
    price: "记录价格",
    demand: "销量",
    rating: "商品评分",
    observed: (date: string) => `记录于 ${date}。价格和库存可能变动。`,
    shop: "在 Shopee 查看",
    comingSoon: "推广链接即将上线",
    shopProduct: (name: string) => `在 Shopee 查看${name}`,
    outdoorTitle: "正在计划户外旅行？",
    outdoorDescription: "想找更多露营和户外装备，可以浏览 LezzCamp 的装备精选。",
    outdoorLink: "查看 LezzCamp 装备",
    guidesTitle: "更多泰国旅行规划建议",
    guidesDescription: "备好旅行用品后，出发前也可以看看目的地指南里的实用建议。",
    guidesLink: "浏览目的地指南",
    noteTitle: "说明",
    note: "如果你通过推广链接购买商品，我们可能会获得佣金，你无需额外付费。实时价格和库存请以 Shopee 为准。",
  },
} satisfies Record<Locale, typeof englishCopy>;

export function travelEssentialsMetadata(locale: Locale): Metadata {
  const { title, description } = TRAVEL_ESSENTIALS_COPY[locale];
  const canonical = TRAVEL_ESSENTIALS_PATHS[locale];

  return {
    title,
    description,
    alternates: { canonical, languages: TRAVEL_ESSENTIALS_ALTERNATES },
    openGraph: { title, description, url: canonical, locale: { en: "en_US", th: "th_TH", zh: "zh_CN" }[locale] },
    twitter: { card: "summary_large_image", title, description },
  };
}
