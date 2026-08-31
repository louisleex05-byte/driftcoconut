// Bilingual dictionary — English (en) and Thai (th).
// Add a new key here, use it via `useT()` in any client component.

export type Locale = "en" | "th";

export const LOCALES: Locale[] = ["en", "th"];

export const DEFAULT_LOCALE: Locale = "en";

export const dictionary = {
  en: {
    // Header + nav
    nav_deals: "Deals",
    nav_about: "About",
    nav_search_aria: "Search",
    header_search_placeholder: "Where to? Try Bali or Tokyo...",
    header_search_aria: "Search destinations",

    // Hero
    hero_title: "Find your next stay",
    hero_subtitle: "Compare thousands of hotels worldwide and book the perfect room.",

    // Deals section
    deals_eyebrow: "Curated for wanderers",
    deals_title: "Where to drift next",
    deals_tropical_title: "Tropical escapes",
    deals_tropical_desc: "Bali, Phuket, Maldives",
    deals_city_title: "City breaks",
    deals_city_desc: "Tokyo, Singapore, HK",
    deals_mountain_title: "Mountain retreats",
    deals_mountain_desc: "Chiang Mai, Kyoto, Sapa",

    // Search form
    search_eyebrow: "Ready to book?",
    search_title: "Search hotels",
    search_destination: "Destination",
    search_check_in: "Check-in",
    search_check_out: "Check-out",
    search_guests: "Guests",
    search_submit: "Search hotels",

    // Travel essentials — headings
    essentials_eyebrow: "Travel essentials",
    essentials_default_heading: "Complete your trip",
    essentials_default_sub: "Everything you need before you leave — curated partners we trust.",
    essentials_hotel_heading: "Complete your stay",
    essentials_hotel_sub: "Everything you need before you leave — curated partners we trust.",
    essentials_about_heading: "Plan your trip end-to-end",
    essentials_about_sub: "Beyond hotels — the essentials we recommend from vetted travel partners.",
    essentials_book_now: "Book now",
    essentials_disclosure:
      "Affiliate disclosure: driftcoconut may earn a small commission when you book through these partners, at no extra cost to you.",

    // Card titles
    card_klook_title: "Book tours & experiences",
    card_klook_sub: "Skip-the-line tickets, cooking classes, day trips",
    card_welcomepickups_title: "Airport transfer",
    card_welcomepickups_sub: "Meet-and-greet, English-speaking drivers",
    card_yesim_title: "Local eSIM data",
    card_yesim_sub: "Stay connected from the moment you land",
    card_kiwi_title: "Compare flights",
    card_kiwi_sub: "Multi-airline routes, hidden-city fares",
    card_aviasales_title: "Flight meta-search",
    card_aviasales_sub: "Scan 100+ airlines and OTAs in one search",
    card_airalo_title: "Airalo global eSIM",
    card_airalo_sub: "200+ countries, install before you land",
    card_ekta_title: "Travel insurance",
    card_ekta_sub: "Medical, baggage, trip cancellation cover",
    card_airhelp_title: "Flight delay refund",
    card_airhelp_sub: "Claim up to €600 for delays or cancellations",
    card_drimsim_title: "Drimsim physical SIM",
    card_drimsim_sub: "Prefer a physical SIM card? Works in 190+ countries",
    card_tiqets_title: "Tiqets attractions",
    card_tiqets_sub: "Museums, landmarks & skip-the-line tickets worldwide",
    card_hot_badge: "Hot",
    card_alt_badge: "Alt",

    // About page
    about_h1: "About driftcoconut",
    about_intro:
      "driftcoconut helps travelers discover and compare hotels across Asia and beyond. We aggregate listings, photos, and real guest reviews from trusted booking partners so you can find the right room, in the right neighborhood, at the right price — without opening a dozen tabs.",
    about_what_h2: "What we do",
    about_what_body:
      "We pull live availability and pricing from major hotel booking networks, then present it in a simple, unified search experience. When you find a stay you like, we send you directly to our partner's secure booking page to complete your reservation. We never charge you more than the partner's listed rate — our income comes from a small referral fee paid by the partner, at no cost to you.",
    about_partners_h2: "Our partners",
    about_partners_body:
      "We work with reputable global hotel networks including Booking.com, Expedia Group (Hotels.com, Expedia, Vrbo), and Tripadvisor Group (Viator). Every listing you see is verified inventory from one of these networks.",
    about_contact_h2: "Contact",
    about_contact_body_prefix: "Questions, feedback, or partnership inquiries? Email ",
    about_disclaimer:
      "driftcoconut is an independent hotel discovery service. Prices and availability are provided by our partners and are subject to change. All bookings and payment are handled by the respective booking partner.",

    // Footer
    footer_tagline: "Search and compare hotels worldwide.",
    footer_col_company: "Company",
    footer_col_legal: "Legal",
    footer_col_partners: "Partners",
    footer_link_contact: "Contact",
    footer_link_privacy: "Privacy",
    footer_link_terms: "Terms",
    footer_copyright: "Powered by affiliate partners. Prices and availability subject to change.",

    // Booking.com CJ card
    booking_card_eyebrow: "Affiliate partner",
    booking_card_title: "Find your stay on Booking.com",
    booking_card_body: "2.3M properties · free cancellation on most stays · price match guarantee.",
    booking_card_cta: "Search hotels →",

    // Guide tips badge (homepage callout)
    guide_tips_pill: "Guide tips",
    guide_tips_eyebrow: "Just published",
    guide_tips_featured_title: "The driftcoconut guide to Bangkok",
    guide_tips_featured_teaser: "A local's picks: where to stay, when to go, and what to skip — from a Bangkok-based writer.",
    guide_tips_read_cta: "Read the guide",
    guide_tips_see_all: "See all guides",

    // Mock-mode notice on search results
    search_mock_notice_title: "You're viewing sample listings",
    search_mock_notice_body: "Our live hotel inventory is coming soon. For real available rooms in this city, use Booking.com below — we'll credit your booking to us.",
    search_booking_card_title_prefix: "Real hotels in ",
    search_booking_card_body: "See live availability & prices from Booking.com's 2.3M+ properties.",

    // Site-wide FTC disclosure (footer)
    footer_ftc_disclosure:
      "driftcoconut participates in affiliate programs including Booking.com, Expedia, Tripadvisor Group (Viator), Klook, and other travel partners. We may earn a commission when you book through our links, at no cost to you.",

    // Language toggle
    lang_toggle_aria: "Switch language",
  },

  th: {
    // Header + nav
    nav_deals: "ดีล",
    nav_about: "เกี่ยวกับเรา",
    nav_search_aria: "ค้นหา",
    header_search_placeholder: "จะไปไหนดี? ลองพิมพ์ บาหลี หรือ โตเกียว...",
    header_search_aria: "ค้นหาจุดหมายปลายทาง",

    // Hero
    hero_title: "ค้นหาที่พักครั้งต่อไป",
    hero_subtitle: "เปรียบเทียบโรงแรมนับพันทั่วโลก และจองห้องพักที่ใช่สำหรับคุณ",

    // Deals section
    deals_eyebrow: "คัดสรรสำหรับนักเดินทาง",
    deals_title: "ล่องลอยไปที่ไหนต่อดี",
    deals_tropical_title: "หลบร้อนไปติดเกาะ",
    deals_tropical_desc: "บาหลี, ภูเก็ต, มัลดีฟส์",
    deals_city_title: "เที่ยวเมืองใหญ่",
    deals_city_desc: "โตเกียว, สิงคโปร์, ฮ่องกง",
    deals_mountain_title: "พักผ่อนกลางขุนเขา",
    deals_mountain_desc: "เชียงใหม่, เกียวโต, ซาปา",

    // Search form
    search_eyebrow: "พร้อมจองแล้วใช่ไหม",
    search_title: "ค้นหาโรงแรม",
    search_destination: "จุดหมายปลายทาง",
    search_check_in: "เช็คอิน",
    search_check_out: "เช็คเอาท์",
    search_guests: "ผู้เข้าพัก",
    search_submit: "ค้นหาโรงแรม",

    // Travel essentials — headings
    essentials_eyebrow: "สิ่งจำเป็นสำหรับการเดินทาง",
    essentials_default_heading: "เติมเต็มการเดินทางของคุณ",
    essentials_default_sub: "ทุกสิ่งที่คุณต้องการก่อนออกเดินทาง — พาร์ทเนอร์ที่เราไว้ใจ",
    essentials_hotel_heading: "เติมเต็มการเข้าพักของคุณ",
    essentials_hotel_sub: "ทุกสิ่งที่คุณต้องการก่อนออกเดินทาง — พาร์ทเนอร์ที่เราไว้ใจ",
    essentials_about_heading: "วางแผนการเดินทางตั้งแต่ต้นจนจบ",
    essentials_about_sub: "นอกจากโรงแรม — สิ่งจำเป็นที่เราแนะนำจากพาร์ทเนอร์ที่ผ่านการคัดสรร",
    essentials_book_now: "จองเลย",
    essentials_disclosure:
      "การเปิดเผย: driftcoconut อาจได้รับค่าคอมมิชชั่นเล็กน้อยเมื่อคุณจองผ่านพาร์ทเนอร์เหล่านี้ โดยคุณไม่ต้องจ่ายเพิ่มใดๆ",

    // Card titles
    card_klook_title: "จองทัวร์และประสบการณ์",
    card_klook_sub: "ตั๋วไม่ต้องต่อคิว, คลาสทำอาหาร, ทริปในวัน",
    card_welcomepickups_title: "รับส่งสนามบิน",
    card_welcomepickups_sub: "คนขับพูดภาษาอังกฤษ พร้อมป้ายชื่อรอรับ",
    card_yesim_title: "eSIM ท้องถิ่น",
    card_yesim_sub: "ต่อเน็ตได้ทันทีที่เครื่องลงจอด",
    card_kiwi_title: "เปรียบเทียบเที่ยวบิน",
    card_kiwi_sub: "หลายสายการบิน, ราคาซ่อนถูกกว่า",
    card_aviasales_title: "ค้นหาเที่ยวบินราคาดี",
    card_aviasales_sub: "สแกน 100+ สายการบินและตัวแทนในครั้งเดียว",
    card_airalo_title: "Airalo eSIM ระดับโลก",
    card_airalo_sub: "รองรับ 200+ ประเทศ ติดตั้งก่อนออกเดินทาง",
    card_ekta_title: "ประกันเดินทาง",
    card_ekta_sub: "คุ้มครองสุขภาพ, กระเป๋าเดินทาง, ยกเลิกทริป",
    card_airhelp_title: "เคลมเงินคืนเที่ยวบินล่าช้า",
    card_airhelp_sub: "เคลมสูงสุด €600 กรณีเที่ยวบินล่าช้าหรือยกเลิก",
    card_drimsim_title: "Drimsim ซิมแบบเสียบเครื่อง",
    card_drimsim_sub: "ชอบซิมการ์ดจริง? ใช้ได้ใน 190+ ประเทศ",
    card_tiqets_title: "Tiqets ตั๋วสถานที่ท่องเที่ยว",
    card_tiqets_sub: "พิพิธภัณฑ์, สถานที่สำคัญ, ตั๋วไม่ต้องต่อคิวทั่วโลก",
    card_hot_badge: "ฮอต",
    card_alt_badge: "ทางเลือก",

    // About page
    about_h1: "เกี่ยวกับ driftcoconut",
    about_intro:
      "driftcoconut ช่วยนักเดินทางค้นหาและเปรียบเทียบโรงแรมทั่วเอเชียและทั่วโลก เรารวบรวมรายการโรงแรม รูปภาพ และรีวิวจริงจากพาร์ทเนอร์จองที่พักที่น่าเชื่อถือ เพื่อให้คุณค้นพบห้องที่ใช่ ในย่านที่ใช่ ในราคาที่ใช่ — โดยไม่ต้องเปิดหลายสิบแท็บ",
    about_what_h2: "เราทำอะไร",
    about_what_body:
      "เราดึงข้อมูลห้องว่างและราคาแบบเรียลไทม์จากเครือข่ายจองโรงแรมชั้นนำ แล้วนำเสนอในหน้าค้นหาที่ใช้งานง่ายเป็นหนึ่งเดียว เมื่อคุณพบที่พักที่ถูกใจ เราจะพาคุณไปจองบนหน้าเว็บของพาร์ทเนอร์โดยตรง เราไม่คิดเงินเพิ่มจากราคาที่พาร์ทเนอร์แสดง — รายได้ของเรามาจากค่าแนะนำเล็กน้อยที่พาร์ทเนอร์จ่ายให้ โดยคุณไม่มีค่าใช้จ่ายเพิ่ม",
    about_partners_h2: "พาร์ทเนอร์ของเรา",
    about_partners_body:
      "เราทำงานร่วมกับเครือข่ายโรงแรมระดับโลกที่น่าเชื่อถือ รวมถึง Booking.com, Expedia Group (Hotels.com, Expedia, Vrbo) และ Tripadvisor Group (Viator) รายการโรงแรมทุกรายการที่คุณเห็นได้รับการยืนยันจากเครือข่ายเหล่านี้",
    about_contact_h2: "ติดต่อเรา",
    about_contact_body_prefix: "มีคำถาม ข้อเสนอแนะ หรือสนใจร่วมเป็นพาร์ทเนอร์? อีเมล ",
    about_disclaimer:
      "driftcoconut เป็นบริการค้นหาโรงแรมอิสระ ราคาและห้องว่างมาจากพาร์ทเนอร์และอาจเปลี่ยนแปลงได้ การจองและชำระเงินทั้งหมดดำเนินการโดยพาร์ทเนอร์แต่ละราย",

    // Footer
    footer_tagline: "ค้นหาและเปรียบเทียบโรงแรมทั่วโลก",
    footer_col_company: "บริษัท",
    footer_col_legal: "ข้อกำหนด",
    footer_col_partners: "พาร์ทเนอร์",
    footer_link_contact: "ติดต่อ",
    footer_link_privacy: "ความเป็นส่วนตัว",
    footer_link_terms: "เงื่อนไข",
    footer_copyright: "ขับเคลื่อนโดยพาร์ทเนอร์ Affiliate ราคาและห้องว่างอาจเปลี่ยนแปลงได้",

    // Booking.com CJ card
    booking_card_eyebrow: "พาร์ทเนอร์ Affiliate",
    booking_card_title: "ค้นหาที่พักบน Booking.com",
    booking_card_body: "โรงแรม 2.3 ล้านแห่งทั่วโลก · ยกเลิกฟรีเกือบทุกที่พัก · การันตีราคาดีที่สุด",
    booking_card_cta: "ค้นหาโรงแรม →",

    // Guide tips badge (homepage callout)
    guide_tips_pill: "คู่มือเที่ยว",
    guide_tips_eyebrow: "เพิ่งเผยแพร่",
    guide_tips_featured_title: "คู่มือกรุงเทพฯ โดย driftcoconut",
    guide_tips_featured_teaser: "คำแนะนำจากคนในพื้นที่: พักที่ไหน ไปช่วงไหน อะไรควรข้าม — จากนักเขียนชาวกรุงเทพฯ",
    guide_tips_read_cta: "อ่านคู่มือ",
    guide_tips_see_all: "ดูคู่มือทั้งหมด",

    // Mock-mode notice on search results
    search_mock_notice_title: "คุณกำลังดูรายการตัวอย่าง",
    search_mock_notice_body: "ระบบค้นหาโรงแรมสดของเราเร็วๆ นี้ สำหรับห้องพักจริงในเมืองนี้ ใช้ Booking.com ด้านล่างได้เลย — เราจะได้ค่าคอมมิชชั่นจากการจองของคุณ",
    search_booking_card_title_prefix: "โรงแรมจริงใน ",
    search_booking_card_body: "ดูห้องว่างและราคาจริงจากโรงแรม 2.3 ล้านแห่งบน Booking.com",

    // Site-wide FTC disclosure (footer)
    footer_ftc_disclosure:
      "driftcoconut เข้าร่วมโปรแกรม Affiliate รวมถึง Booking.com, Expedia, Tripadvisor Group (Viator), Klook และพาร์ทเนอร์การเดินทางรายอื่น เราอาจได้รับค่าคอมมิชชั่นเมื่อคุณจองผ่านลิงก์ของเรา โดยคุณไม่มีค่าใช้จ่ายเพิ่ม",

    // Language toggle
    lang_toggle_aria: "เปลี่ยนภาษา",
  },
} as const;

export type TranslationKey = keyof typeof dictionary["en"];
