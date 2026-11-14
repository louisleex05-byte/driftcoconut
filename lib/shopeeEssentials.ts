import type { Locale } from "@/lib/i18n";

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
export const SHOPEE_ESSENTIALS = [
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
    category: "backpack",
    name: "MOTOWOLF MDL 0714 backpack",
    imageUrl: "https://down-bs-th.img.susercontent.com/9a1ee9dd76e492f15ae568ba4b2e9189.webp",
    sourceProductUrl: "https://shopee.co.th/product/60401191/17081465548",
    affiliateUrl: "https://s.shopee.co.th/9AQ9h8QtJ3",
    status: "ready",
  },
  {
    id: "53271055902",
    category: "backpack",
    name: "Commuter and motorcycle travel backpack",
    imageUrl: "https://down-bs-th.img.susercontent.com/sg-11134201-825b5-mv1ap577j2td17.webp",
    sourceProductUrl: "https://shopee.co.th/product/1914675362/53271055902",
    affiliateUrl: "https://s.shopee.co.th/4LKtwHaRLI",
    status: "ready",
  },
  {
    id: "28310377702",
    category: "backpack",
    name: "The North Face Base Camp Fuse Box backpack",
    imageUrl: "https://down-th.img.susercontent.com/file/th-11134207-7ra0q-mdlenuod86oj05@resize_w450_nl.webp",
    sourceProductUrl: "https://shopee.co.th/product/383860522/28310377702",
    affiliateUrl: "https://s.shopee.co.th/9pfqUQSmsZ",
    status: "ready",
  },
  {
    id: "47319781244",
    category: "backpack",
    name: "S431 30L patrol backpack",
    imageUrl: "https://down-zl-th.img.susercontent.com/sg-11134201-8257y-munhkjxtpxqbae.webp",
    sourceProductUrl: "https://shopee.co.th/product/1934412192/47319781244",
    affiliateUrl: "https://s.shopee.co.th/AUvXHi6PpJ",
    status: "ready",
  },
  {
    id: "55061120901",
    category: "backpack",
    name: "Anmei Road 30L hiking backpack",
    imageUrl: "https://down-zl-th.img.susercontent.com/sg-11134201-823pz-mooh5xitmcy433.webp",
    sourceProductUrl: "https://shopee.co.th/product/1825427368/55061120901",
    affiliateUrl: "https://s.shopee.co.th/4VeK8iFBJ1",
    status: "ready",
  },
  {
    id: "26666417108",
    category: "backpack",
    name: "AI ONE 40L hiking backpack",
    imageUrl: "https://down-th.img.susercontent.com/file/sg-11134201-7rcdk-m69b9wnyueej47@resize_w450_nl.webp",
    sourceProductUrl: "https://shopee.co.th/product/1393885700/26666417108",
    affiliateUrl: "https://s.shopee.co.th/9fMQIHBQWM",
    status: "ready",
  },
  {
    id: "54507489361",
    category: "backpack",
    name: "WIS PSHP black backpack",
    imageUrl: "https://down-zl-th.img.susercontent.com/id-11134207-822wh-mm2wcb402i338e.webp",
    sourceProductUrl: "https://shopee.co.th/product/877231766/54507489361",
    affiliateUrl: "https://s.shopee.co.th/7Af5JhPhCi",
    status: "ready",
  },
] as const satisfies readonly ShopeeEssential[];

type ProductCopy = Pick<ShopeeEssential, "name" | "reason" | "observedPrice" | "observedDemand" | "observedRating">;
type ProductId = (typeof SHOPEE_ESSENTIALS)[number]["id"];

const PRODUCT_TRANSLATIONS: Record<ProductId, Record<Exclude<Locale, "en">, ProductCopy>> = {
  "anker-20000mah-87w": {
    th: {
      name: "พาวเวอร์แบงก์ Anker 20,000 mAh 87 W",
      reason: "ความจุสูง เหมาะกับวันเดินทางยาว ๆ ช่วงต่อรถหรือต่อเครื่อง และการชาร์จหลายอุปกรณ์",
      observedPrice: "฿2,009",
      observedDemand: "ขายแล้ว 892 ชิ้น",
      observedRating: "4.9/5 จาก 320 คะแนน",
    },
    zh: {
      name: "Anker 20,000 mAh 87 W 充电宝",
      reason: "大容量，适合长途出行、转乘途中或给多台设备充电。",
      observedPrice: "฿2,009",
      observedDemand: "已售 892 件",
      observedRating: "4.9/5（320 个评分）",
    },
  },
  "mobi-garden-fold-tug-110l": {
    th: {
      name: "กระเป๋าพับได้ MOBI GARDEN Fold Tug Pack 110 ลิตร",
      reason: "พับเก็บให้เล็กได้ และกางเป็นกระเป๋าเสริมสำหรับใส่อุปกรณ์หรือของฝาก",
      observedPrice: "฿798",
      observedDemand: "ขายแล้วกว่า 2,000 ชิ้น",
      observedRating: "5.0/5 จาก 1,100 คะแนน",
    },
    zh: {
      name: "MOBI GARDEN Fold Tug Pack 110 升折叠旅行包",
      reason: "不用时可折叠收纳，展开后可装装备或伴手礼。",
      observedPrice: "฿798",
      observedDemand: "已售逾 2,000 件",
      observedRating: "5.0/5（1,100 个评分）",
    },
  },
  "packing-organizer-bundle": {
    th: {
      name: "ชุดถุงจัดกระเป๋าแบบบีบอัด",
      reason: "แยกเสื้อผ้า รองเท้า และของใช้ส่วนตัวให้เป็นระเบียบในกระเป๋าเดินทางหรือกระเป๋าเป้",
      observedPrice: "฿105",
      observedDemand: "ขายแล้วกว่า 3,000 ชิ้น",
      observedRating: "4.9/5 จาก 340 คะแนน",
    },
    zh: {
      name: "旅行压缩收纳袋套装",
      reason: "把衣服、鞋子和洗漱用品分开收纳，适合放在行李箱或背包里。",
      observedPrice: "฿105",
      observedDemand: "已售逾 3,000 件",
      observedRating: "4.9/5（340 个评分）",
    },
  },
  "deli-10a-universal-adapter": {
    th: {
      name: "หัวแปลงปลั๊กอเนกประสงค์ Deli 10 A 2,500 W พร้อม USB-A และ USB-C",
      reason: "มีช่องเสียบหลายแบบ เหมาะกับการใช้งานในห้องพัก ควรตรวจสอบว่ารองรับปลั๊กของอุปกรณ์ก่อนใช้",
      observedPrice: "฿139 หลังใช้คูปอง",
      observedDemand: "ขายแล้วกว่า 10,000 ชิ้น",
      observedRating: "4.9/5 จาก 2,500 คะแนน",
    },
    zh: {
      name: "Deli 10 A 2,500 W 万用转换插头（USB-A／USB-C）",
      reason: "有多种插孔，适合在酒店房间使用。使用前请确认插头与设备兼容。",
      observedPrice: "用券后 ฿139",
      observedDemand: "已售逾 10,000 件",
      observedRating: "4.9/5（2,500 个评分）",
    },
  },
  "fnkvision-waterproof-phone-case": {
    th: {
      name: "ซองกันน้ำสำหรับโทรศัพท์ FNKvision",
      reason: "ช่วยป้องกันโทรศัพท์จากน้ำเมื่อไปเที่ยวทะเลหรือเดินทางช่วงหน้าฝน ควรเลือกให้ตรงกับรุ่นโทรศัพท์",
      observedPrice: "ดูราคาตามรุ่นที่เลือก",
      observedDemand: "ขายแล้วกว่า 3,000 ชิ้น",
      observedRating: "4.9/5 จาก 705 คะแนน",
    },
    zh: {
      name: "FNKvision 手机防水套",
      reason: "适合海边游玩或雨季出行，请选与手机型号匹配的款式。",
      observedPrice: "价格以所选款式为准",
      observedDemand: "已售逾 3,000 件",
      observedRating: "4.9/5（705 个评分）",
    },
  },
  "17081465548": {
    th: { name: "กระเป๋าเป้ MOTOWOLF MDL 0714" },
    zh: { name: "MOTOWOLF MDL 0714 双肩背包" },
  },
  "53271055902": {
    th: { name: "กระเป๋าเป้สำหรับเดินทางประจำวันและขี่มอเตอร์ไซค์" },
    zh: { name: "通勤及摩托车旅行背包" },
  },
  "28310377702": {
    th: { name: "กระเป๋าเป้ The North Face Base Camp Fuse Box" },
    zh: { name: "The North Face Base Camp Fuse Box 双肩背包" },
  },
  "47319781244": {
    th: { name: "กระเป๋าเป้สายตรวจ S431 ขนาด 30 ลิตร" },
    zh: { name: "S431 30 升巡逻背包" },
  },
  "55061120901": {
    th: { name: "กระเป๋าเป้เดินป่า Anmei Road 30 ลิตร" },
    zh: { name: "Anmei Road 30 升徒步背包" },
  },
  "26666417108": {
    th: { name: "กระเป๋าเป้เดินป่า AI ONE 40 ลิตร" },
    zh: { name: "AI ONE 40 升徒步背包" },
  },
  "54507489361": {
    th: { name: "กระเป๋าเป้สีดำ WIS PSHP" },
    zh: { name: "WIS PSHP 黑色双肩背包" },
  },
};

export function localizedShopeeEssentials(locale: Locale): readonly ShopeeEssential[] {
  if (locale === "en") return SHOPEE_ESSENTIALS;
  return SHOPEE_ESSENTIALS.map((product) => ({ ...product, ...PRODUCT_TRANSLATIONS[product.id][locale] }));
}

export const SHOPEE_ESSENTIAL_CATEGORIES = [
  {
    id: "backpack",
    copy: {
      en: { title: "Backpack", description: "Bags for day trips, longer journeys, and extra luggage." },
      th: { title: "กระเป๋าเป้", description: "กระเป๋าสำหรับทริปวันเดียว ทริปหลายวัน และใส่สัมภาระเพิ่มเติม" },
      zh: { title: "旅行背包", description: "适合一日游、长途旅行或装额外行李的包袋。" },
    },
    icon: "🎒",
  },
  {
    id: "power",
    copy: {
      en: { title: "Power gadgets", description: "Chargers, adapters, and power banks for travel." },
      th: { title: "อุปกรณ์ชาร์จไฟ", description: "ที่ชาร์จ หัวแปลงปลั๊ก และพาวเวอร์แบงก์สำหรับเดินทาง" },
      zh: { title: "充电设备", description: "适合旅途使用的充电器、转换插头和充电宝。" },
    },
    icon: "⚡",
  },
  {
    id: "other",
    copy: {
      en: { title: "Other essentials", description: "Organizers, phone protection, and other practical gear." },
      th: { title: "ของใช้จำเป็นอื่น ๆ", description: "ถุงจัดกระเป๋า ซองป้องกันโทรศัพท์ และของใช้ที่มีประโยชน์ระหว่างเดินทาง" },
      zh: { title: "其他旅行用品", description: "行李收纳袋、手机防护用品和其他实用装备。" },
    },
    icon: "🧳",
  },
] as const;
