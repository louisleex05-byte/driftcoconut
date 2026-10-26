export type ShopeeEssentialStatus = "ready" | "pending-affiliate-link" | "under-review";

export type ShopeeEssential = {
  id: string;
  category: "power" | "packing" | "water";
  name: string;
  reason: string;
  observedPrice: string;
  observedRating: string;
  observedDemand: string;
  observedAt: string;
  imageUrl: string;
  sourceProductUrl: string;
  affiliateUrl?: string;
  status: ShopeeEssentialStatus;
};

// Product facts below were recorded from the Shopee product feed and public
// product listings on 2026-10-09. Affiliate URLs appear only after their
// destination product ID has been verified against the affiliate dashboard.
export const SHOPEE_ESSENTIALS: ShopeeEssential[] = [
  {
    id: "anker-20000mah-87w",
    category: "power",
    name: "Anker 20,000mAh 87W power bank",
    reason: "A high-capacity option for long travel days, transfers, and several devices.",
    observedPrice: "฿2,009",
    observedRating: "4.9/5 from 320 ratings",
    observedDemand: "892 sold",
    observedAt: "2026-10-09",
    imageUrl: "https://cf.shopee.co.th/file/sg-11134201-825b7-mu20o5vq9535de",
    sourceProductUrl: "https://shopee.co.th/product/628267390/43455979939",
    affiliateUrl: "https://s.shopee.co.th/1BMylPKXYt",
    status: "ready",
  },
  {
    id: "mobi-garden-fold-tug-110l",
    category: "packing",
    name: "MOBI GARDEN Fold Tug Pack 110L",
    reason: "Packs down small, then expands into extra luggage for gear or souvenirs.",
    observedPrice: "฿798",
    observedRating: "5.0/5 from 1.1k ratings",
    observedDemand: "2k+ sold",
    observedAt: "2026-10-09",
    imageUrl: "https://cf.shopee.co.th/file/th-11134201-23030-2eu94xxaflovec",
    sourceProductUrl: "https://shopee.co.th/product/805054264/12897228167",
    affiliateUrl: "https://s.shopee.co.th/2VsMKUNbkW",
    status: "ready",
  },
  {
    id: "packing-organizer-bundle",
    category: "packing",
    name: "Compression packing organizer bundle",
    reason: "Keeps clothes, shoes, and toiletries separated in a suitcase or backpack.",
    observedPrice: "฿105",
    observedRating: "4.9/5 from 340 ratings",
    observedDemand: "3k+ sold",
    observedAt: "2026-10-09",
    imageUrl: "https://cf.shopee.co.th/file/sg-11134201-82616-mkhsl610ghdzea",
    sourceProductUrl: "https://shopee.co.th/product/1670108781/49056004042",
    affiliateUrl: "https://s.shopee.co.th/AKbDgTb6iZ",
    status: "ready",
  },
  {
    id: "deli-10a-universal-adapter",
    category: "power",
    name: "Deli 10A 2500W USB-A/USB-C universal adapter",
    reason: "A multi-socket option for hotel rooms and devices that needs a final plug-compatibility check.",
    observedPrice: "฿139 after voucher",
    observedRating: "4.9/5 from 2.5k ratings",
    observedDemand: "10k+ sold",
    observedAt: "2026-10-09",
    imageUrl: "https://cf.shopee.co.th/file/th-11134207-7ra0l-mchmwrbvxedcbd",
    sourceProductUrl: "https://shopee.co.th/product/1541050128/40157621059",
    affiliateUrl: "https://s.shopee.co.th/5LCXhsgotk",
    status: "ready",
  },
  {
    id: "fnkvision-waterproof-phone-case",
    category: "water",
    name: "FNKvision waterproof phone case",
    reason: "A device-specific water-protection option for beach and rainy-season trips.",
    observedPrice: "Check selected variant",
    observedRating: "4.9/5 from 705 ratings",
    observedDemand: "3k+ sold",
    observedAt: "2026-10-09",
    imageUrl: "https://cf.shopee.co.th/file/th-11134207-81ztd-mlrkyzbal1c82d",
    sourceProductUrl: "https://shopee.co.th/product/1202375356/28626469044",
    affiliateUrl: "https://s.shopee.co.th/8AWj6Q3jM5",
    status: "ready",
  },
];

export const SHOPEE_ESSENTIAL_CATEGORIES = [
  {
    id: "power",
    title: "Power and connectivity",
    description: "Stay charged and connected through transfers, day trips, and long journeys.",
    icon: "⚡",
  },
  {
    id: "packing",
    title: "Pack smarter",
    description: "Make room for the essentials and keep luggage organised from door to hotel.",
    icon: "🧳",
  },
  {
    id: "water",
    title: "Ready for water",
    description: "Protect the items that matter when Thailand turns wet, tropical, or beach-bound.",
    icon: "🌊",
  },
] as const;
