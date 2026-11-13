export type ShopeeEssentialStatus = "ready" | "pending-affiliate-link" | "under-review";

export type ShopeeEssential = {
  id: string;
  category: "backpack" | "power" | "other";
  name: string;
  reason?: string;
  observedPrice?: string;
  observedRating?: string;
  observedDemand?: string;
  observedAt?: string;
  imageUrl?: string;
  sourceProductUrl: string;
  affiliateUrl?: string;
  status: ShopeeEssentialStatus;
};

// Include observed product facts only when the listing has been checked.
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
    affiliateUrl: "https://s.shopee.co.th/5VWWRwR7tr",
    status: "ready",
  },
  {
    id: "mobi-garden-fold-tug-110l",
    category: "backpack",
    name: "MOBI GARDEN Fold Tug Pack 110L",
    reason: "Packs down small, then expands into extra luggage for gear or souvenirs.",
    observedPrice: "฿798",
    observedRating: "5.0/5 from 1.1k ratings",
    observedDemand: "2k+ sold",
    observedAt: "2026-10-09",
    imageUrl: "https://cf.shopee.co.th/file/th-11134201-23030-2eu94xxaflovec",
    sourceProductUrl: "https://shopee.co.th/product/805054264/12897228167",
    affiliateUrl: "https://s.shopee.co.th/1LgxUJ2JAl",
    status: "ready",
  },
  {
    id: "packing-organizer-bundle",
    category: "other",
    name: "Compression packing organizer bundle",
    reason: "Keeps clothes, shoes, and toiletries separated in a suitcase or backpack.",
    observedPrice: "฿105",
    observedRating: "4.9/5 from 340 ratings",
    observedDemand: "3k+ sold",
    observedAt: "2026-10-09",
    imageUrl: "https://cf.shopee.co.th/file/sg-11134201-82616-mkhsl610ghdzea",
    sourceProductUrl: "https://shopee.co.th/product/1670108781/49056004042",
    affiliateUrl: "https://s.shopee.co.th/7fb11xZfXe",
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
    affiliateUrl: "https://s.shopee.co.th/BV06CInU8",
    status: "ready",
  },
  {
    id: "fnkvision-waterproof-phone-case",
    category: "other",
    name: "FNKvision waterproof phone case",
    reason: "A device-specific water-protection option for beach and rainy-season trips.",
    observedPrice: "Check selected variant",
    observedRating: "4.9/5 from 705 ratings",
    observedDemand: "3k+ sold",
    observedAt: "2026-10-09",
    imageUrl: "https://cf.shopee.co.th/file/th-11134207-81ztd-mlrkyzbal1c82d",
    sourceProductUrl: "https://shopee.co.th/product/1202375356/28626469044",
    affiliateUrl: "https://s.shopee.co.th/1W0Ngf8zDP",
    status: "ready",
  },
  {
    id: "17081465548",
    category: "power",
    name: "MOTOWOLF MDL 0714 backpack",
    imageUrl: "https://down-bs-th.img.susercontent.com/9a1ee9dd76e492f15ae568ba4b2e9189.webp",
    sourceProductUrl: "https://shopee.co.th/product/60401191/17081465548",
    affiliateUrl: "https://s.shopee.co.th/9AQ9h8QtJ3",
    status: "ready",
  },
  {
    id: "53271055902",
    category: "power",
    name: "Commuter and motorcycle travel backpack",
    imageUrl: "https://down-bs-th.img.susercontent.com/sg-11134201-825b5-mv1ap577j2td17.webp",
    sourceProductUrl: "https://shopee.co.th/product/1914675362/53271055902",
    affiliateUrl: "https://s.shopee.co.th/4LKtwHaRLI",
    status: "ready",
  },
  {
    id: "28310377702",
    category: "power",
    name: "Shopee listing #28310377702",
    sourceProductUrl: "https://shopee.co.th/product/383860522/28310377702",
    affiliateUrl: "https://s.shopee.co.th/9pfqUQSmsZ",
    status: "ready",
  },
  {
    id: "47319781244",
    category: "power",
    name: "S431 30L patrol backpack",
    imageUrl: "https://down-zl-th.img.susercontent.com/sg-11134201-8257y-munhkjxtpxqbae.webp",
    sourceProductUrl: "https://shopee.co.th/product/1934412192/47319781244",
    affiliateUrl: "https://s.shopee.co.th/AUvXHi6PpJ",
    status: "ready",
  },
  {
    id: "53069750649",
    category: "power",
    name: "S429 12L mini backpack",
    imageUrl: "https://down-zl-th.img.susercontent.com/sg-11134201-8259r-mun0sp5perk219.webp",
    sourceProductUrl: "https://shopee.co.th/product/1934412192/53069750649",
    affiliateUrl: "https://s.shopee.co.th/3B8wYFXisd",
    status: "ready",
  },
  {
    id: "55061120901",
    category: "power",
    name: "Anmei Road 30L hiking backpack",
    imageUrl: "https://down-zl-th.img.susercontent.com/sg-11134201-823pz-mooh5xitmcy433.webp",
    sourceProductUrl: "https://shopee.co.th/product/1825427368/55061120901",
    affiliateUrl: "https://s.shopee.co.th/4VeK8iFBJ1",
    status: "ready",
  },
  {
    id: "26666417108",
    category: "power",
    name: "Shopee listing #26666417108",
    sourceProductUrl: "https://shopee.co.th/product/1393885700/26666417108",
    affiliateUrl: "https://s.shopee.co.th/9fMQIHBQWM",
    status: "ready",
  },
  {
    id: "54507489361",
    category: "power",
    name: "WIS PSHP black backpack",
    imageUrl: "https://down-zl-th.img.susercontent.com/id-11134207-822wh-mm2wcb402i338e.webp",
    sourceProductUrl: "https://shopee.co.th/product/877231766/54507489361",
    affiliateUrl: "https://s.shopee.co.th/7Af5JhPhCi",
    status: "ready",
  },
];

export const SHOPEE_ESSENTIAL_CATEGORIES = [
  {
    id: "backpack",
    title: "Backpack",
    description: "Bags for day trips, longer journeys, and extra luggage.",
    icon: "🎒",
  },
  {
    id: "power",
    title: "Power gadgets",
    description: "Chargers, adapters, and power banks for travel.",
    icon: "⚡",
  },
  {
    id: "other",
    title: "Other essentials",
    description: "Organizers, phone protection, and other practical gear.",
    icon: "🧳",
  },
] as const;
