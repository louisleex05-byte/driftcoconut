// Trilingual dictionary — English (en), Thai (th), Chinese Simplified (zh).
// Add a new key here, use it via `useT()` in any client component.
// Chinese added 2026-09-23 to unlock Xiaohongshu/RedNote + Chinese-searching audience.

export type Locale = "en" | "th" | "zh";

export const LOCALES: Locale[] = ["en", "th", "zh"];

export const DEFAULT_LOCALE: Locale = "en";

// Human-readable labels for the language switcher
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  th: "ไทย",
  zh: "中文",
};

export const dictionary = {
  en: {
    // Header + nav
    nav_deals: "Deals",
    nav_about: "About",
    nav_search_aria: "Search",
    header_search_placeholder: "Where to? Try Bali or Tokyo...",
    header_search_aria: "Search destinations",

    // Hero
    // Positioning: "Travel Asia like someone who knows the place." Locally-written Asia guides
    // are the product; Booking.com booking is the convenience. NOT a metasearch, and no
    // "live availability" claim until real (non-mock) hotel data is on.
    hero_title: "Travel Asia like someone who knows the place.",
    hero_subtitle: "Honest local guides, neighborhood advice and hotels you can book in one place.",

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

    // Trip planner (journey-based layout: before → land → there → problems)
    // "{dest}" is replaced with the guide's city name where one is known.
    plan_eyebrow: "Trip planner",
    plan_heading: "Plan your trip, step by step",
    plan_heading_dest: "Plan your {dest} trip, step by step",
    plan_sub: "What to sort out and when: from booking, to landing, to getting home smoothly.",
    plan_urgency_label: "When are you flying?",
    plan_urgency_week: "This week",
    plan_urgency_month: "Within a month",
    plan_urgency_later: "Later",
    plan_do_first: "Do first",
    plan_also: "Also",
    plan_s1_title: "Before you go",
    plan_s1_sub: "Sorted by what's most urgent for your dates.",
    plan_s2_title: "When you land",
    plan_s2_sub: "From the airport to your bed, without the haggling.",
    plan_s3_title: "While you're there",
    plan_s3_sub: "Tickets and day trips worth booking ahead.",
    plan_s4_title: "If things go wrong",
    plan_s4_sub: "Delays, cancellations and claims. Worth knowing before you fly.",
    plan_hotels_title: "Find a hotel",
    plan_hotels_dest_title: "Hotels in {dest}",
    plan_hotels_sub: "Compare stays on Booking.com, with neighborhood advice from our guides",
    plan_transfer_dest_title: "{dest} airport transfer",
    plan_tours_dest_title: "{dest} tours & day trips",
    plan_claim_title: "Insurance assistance",
    plan_claim_sub: "Already covered? Check your policy and start a claim with your insurer.",
    plan_cars_title: "Rent a car",
    plan_cars_sub: "Compare car rental companies and book ahead",
    plan_attractions_title: "Booking.com Attractions",
    plan_attractions_sub: "Tickets and tours from the Booking.com you already use",
    plan_compensation_title: "Flight compensation check",
    plan_compensation_sub: "Delayed, cancelled or overbooked? See if you're owed compensation",
    plan_bikes_title: "Rent a scooter or bike",
    plan_bikes_sub: "Compare local scooter and bike rentals. Check your licence and insurance first",
    plan_gocity_title: "Go City attraction passes",
    plan_gocity_sub: "One pass that covers multiple attractions in a city",
    plan_transfer_to_title: "Transfer to {dest}",
    plan_transfer_to_sub: "Pre-book a private ride from your arrival airport, station or pier",

    // About page
    about_h1: "About driftcoconut",
    about_intro:
      "driftcoconut is an independent Asia travel guide site. We write practical guides, starting with Thailand and Bali, that tell you which neighborhood to stay in, when to go, what things cost and what to watch out for, so you can choose where to stay with confidence.",
    about_what_h2: "How the guides are made",
    about_what_body:
      "Each guide is written by Mr. Padthai Jaidee, a Bangkok-based writer, and researched from published sources such as ferry operators, tourism authorities, dive and tour operators and weather data. Prices are planning ranges, not live quotes, and every guide shows the date it was last updated. When you are ready to book, our links take you to our partners' own websites, such as Booking.com for hotels, where you complete the booking and payment. We never see or store your payment details.",
    about_money_h2: "How we earn money",
    about_money_body:
      "We earn a commission when you book or buy through some of our links, at no extra cost to you. The guides are written first and the links are added to them afterward. Please treat prices, visa rules and opening hours as a starting point and confirm them with the official source before you travel.",
    about_author_h2: "Who writes the guides",
    about_author_body:
      "Mr. Padthai Jaidee writes the driftcoconut guides from Bangkok. He is a Thai traveler who writes about places he knows and checks prices, schedules and rules against published sources before each update. Questions for the author go to the email address below.",
    about_editorial_h2: "Our editorial approach",
    about_editorial_body:
      "Prices, ferry times and entry fees come from published sources and are given as ranges. Every guide shows its last update date. Where we could not confirm a detail, we try to say so. If you spot a mistake, email us and we will check it and correct the guide.",
    about_partners_h2: "Our partners",
    about_partners_body:
      "Hotels: Booking.com (plus MakeMyTrip and Goibibo for readers in India). Tours and tickets: Klook, KKday, Tiqets, Go City and Booking.com Attractions. Flights: Aviasales and Kiwi.com. Transfers and rentals: Welcome Pickups, Kiwitaxi, GetRentacar and BikesBooking. eSIMs and SIMs: Yesim, Airalo, Saily and Drimsim. Insurance and claims: Ekta, AirHelp and Compensair.",
    about_status_h2: "What is live and what is not",
    about_status_body:
      "Hotel search sends you to Booking.com's live results. Any sample listings on our search page are labelled as samples while we build our own hotel data. Guides are updated as prices and rules change, but they can fall behind, so check the update date at the top of each guide.",
    about_contact_h2: "Contact",
    about_contact_body_prefix: "Questions, corrections or partnership inquiries? Email ",
    about_disclaimer:
      "driftcoconut is an independent travel guide and referral site. Prices and availability come from our partners and change often. All bookings and payments are handled by the partner. We are not a travel agent, airline or insurer.",

    // Footer
    footer_tagline: "Asia travel guides and where to stay.",
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
    booking_card_body: "2.3M properties · free cancellation on many stays (terms vary) · Booking.com's price match.",
    booking_card_cta: "Search hotels →",

    // Guide tips badge (homepage callout)
    guide_tips_pill: "Guide tips",
    guide_tips_eyebrow: "Just published",
    guide_tips_featured_title: "The driftcoconut guide to Bangkok",
    guide_tips_featured_teaser: "A local's picks: where to stay, when to go, and what to skip — from a Bangkok-based writer.",
    guide_tips_read_cta: "Read the guide",
    guide_tips_see_all: "See all guides",

    // Featured guides section (homepage funnel into written guide content)
    featured_guides_eyebrow: "Written by people who've been there",
    featured_guides_title: "Start with a guide",
    featured_guides_subtitle: "Skip the generic listicles — real neighborhoods, real prices, real opinions.",
    featured_guides_cta: "Browse all guides",

    // Mock-mode notice on search results
    search_mock_notice_title: "You're viewing sample listings",
    search_mock_notice_body: "Our live hotel inventory is coming soon. For real available rooms in this city, use Booking.com below — we'll credit your booking to us.",
    search_booking_card_title_prefix: "Real hotels in ",
    search_booking_card_body: "See live availability & prices from Booking.com's 2.3M+ properties.",

    // Site-wide FTC disclosure (footer)
    // Lists ONLY active affiliate relationships. Do not add programs before approval;
    // the earlier version listed Expedia and Tripadvisor which we never signed with.
    footer_ftc_disclosure:
      "driftcoconut participates in affiliate programs with Booking.com, MakeMyTrip, Goibibo, Klook, KKday, Tiqets, Go City, Airalo, Yesim, Saily, Drimsim, Welcome Pickups, Kiwitaxi, GetRentacar, BikesBooking, Aviasales, Kiwi.com, Ekta, AirHelp and Compensair. We may earn a commission when you book or buy through our links, at no cost to you.",

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
    hero_title: "เที่ยวเอเชียแบบคนที่รู้จักที่นั่นดี",
    hero_subtitle: "คู่มือท้องถิ่นที่ตรงไปตรงมา คำแนะนำแต่ละย่าน และโรงแรมที่จองได้ในที่เดียว",

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

    // Trip planner
    plan_eyebrow: "วางแผนทริป",
    plan_heading: "วางแผนทริปทีละขั้นตอน",
    plan_heading_dest: "วางแผนทริป {dest} ทีละขั้นตอน",
    plan_sub: "อะไรควรจัดการและเมื่อไหร่ ตั้งแต่การจอง ถึงวันที่ลงเครื่อง จนถึงวันกลับบ้าน",
    plan_urgency_label: "คุณจะเดินทางเมื่อไหร่?",
    plan_urgency_week: "สัปดาห์นี้",
    plan_urgency_month: "ภายในหนึ่งเดือน",
    plan_urgency_later: "อีกนาน",
    plan_do_first: "ทำก่อน",
    plan_also: "อีกทางเลือก",
    plan_s1_title: "ก่อนออกเดินทาง",
    plan_s1_sub: "เรียงตามความเร่งด่วนสำหรับวันเดินทางของคุณ",
    plan_s2_title: "เมื่อลงเครื่อง",
    plan_s2_sub: "จากสนามบินถึงที่พัก โดยไม่ต้องต่อรอง",
    plan_s3_title: "ระหว่างอยู่ที่นั่น",
    plan_s3_sub: "ตั๋วและทริปวันเดียวที่ควรจองล่วงหน้า",
    plan_s4_title: "หากมีอะไรผิดพลาด",
    plan_s4_sub: "ความล่าช้า การยกเลิก และการเคลม ควรรู้ไว้ก่อนบิน",
    plan_hotels_title: "ค้นหาโรงแรม",
    plan_hotels_dest_title: "โรงแรมใน {dest}",
    plan_hotels_sub: "เปรียบเทียบที่พักบน Booking.com พร้อมคำแนะนำย่านจากคู่มือของเรา",
    plan_transfer_dest_title: "รถรับส่งสนามบิน {dest}",
    plan_tours_dest_title: "ทัวร์และทริปวันเดียว {dest}",
    plan_claim_title: "ความช่วยเหลือด้านประกัน",
    plan_claim_sub: "มีประกันแล้ว? ตรวจสอบกรมธรรม์และเริ่มเคลมกับบริษัทประกันของคุณ",
    plan_cars_title: "เช่ารถ",
    plan_cars_sub: "เปรียบเทียบบริษัทรถเช่าและจองล่วงหน้า",
    plan_attractions_title: "Booking.com Attractions",
    plan_attractions_sub: "ตั๋วและทัวร์จาก Booking.com ที่คุณใช้อยู่แล้ว",
    plan_compensation_title: "ตรวจสอบสิทธิ์เงินชดเชยเที่ยวบิน",
    plan_compensation_sub: "เที่ยวบินล่าช้า ยกเลิก หรือจองเกิน? ดูว่าคุณมีสิทธิ์ได้รับเงินชดเชยหรือไม่",
    plan_bikes_title: "เช่าสกูตเตอร์หรือจักรยาน",
    plan_bikes_sub: "เปรียบเทียบร้านเช่าสกูตเตอร์และจักรยานในพื้นที่ ตรวจสอบใบขับขี่และประกันก่อน",
    plan_gocity_title: "บัตรเข้าชมสถานที่ Go City",
    plan_gocity_sub: "บัตรใบเดียวเข้าชมสถานที่ท่องเที่ยวหลายแห่งในเมือง",
    plan_transfer_to_title: "รถรับส่งไป {dest}",
    plan_transfer_to_sub: "จองรถส่วนตัวล่วงหน้าจากสนามบิน สถานี หรือท่าเรือที่คุณไปถึง",

    // About page
    about_h1: "เกี่ยวกับ driftcoconut",
    about_intro:
      "driftcoconut คือเว็บไซต์คู่มือท่องเที่ยวเอเชียที่เป็นอิสระ เราเขียนคู่มือที่ใช้ได้จริง เริ่มจากประเทศไทยและบาหลี บอกว่าควรพักย่านไหน ไปช่วงไหนดี ค่าใช้จ่ายเท่าไร และอะไรที่ควรระวัง เพื่อให้คุณเลือกที่พักได้อย่างมั่นใจ",
    about_what_h2: "คู่มือของเราทำอย่างไร",
    about_what_body:
      "คู่มือแต่ละเล่มเขียนโดย Mr. Padthai Jaidee นักเขียนที่อยู่ในกรุงเทพฯ และรวบรวมจากแหล่งข้อมูลที่เผยแพร่ เช่น ผู้ให้บริการเรือเฟอร์รี่ หน่วยงานการท่องเที่ยว ร้านดำน้ำและผู้จัดทัวร์ และข้อมูลสภาพอากาศ ราคาเป็นช่วงสำหรับวางแผน ไม่ใช่ราคาสด และทุกคู่มือแสดงวันที่อัปเดตล่าสุด เมื่อคุณพร้อมจอง ลิงก์ของเราจะพาไปยังเว็บไซต์ของพาร์ทเนอร์ เช่น Booking.com สำหรับที่พัก ซึ่งคุณจะจองและชำระเงินที่นั่น เราไม่เห็นและไม่เก็บข้อมูลการชำระเงินของคุณ",
    about_money_h2: "เรามีรายได้อย่างไร",
    about_money_body:
      "เราได้รับค่าคอมมิชชั่นเมื่อคุณจองหรือซื้อผ่านลิงก์บางรายการของเรา โดยคุณไม่ต้องจ่ายเพิ่ม เราเขียนคู่มือก่อน แล้วจึงเพิ่มลิงก์เข้าไปทีหลัง โปรดใช้ราคา กฎวีซ่า และเวลาเปิดทำการเป็นข้อมูลเบื้องต้น และตรวจสอบกับแหล่งข้อมูลทางการก่อนเดินทาง",
    about_author_h2: "ใครเป็นคนเขียนคู่มือ",
    about_author_body:
      "Mr. Padthai Jaidee เขียนคู่มือของ driftcoconut จากกรุงเทพฯ เขาเป็นนักเดินทางชาวไทยที่เขียนเกี่ยวกับสถานที่ที่เขารู้จัก และตรวจสอบราคา ตารางเวลา และกฎระเบียบกับแหล่งข้อมูลที่เผยแพร่ก่อนอัปเดตทุกครั้ง หากมีคำถามถึงผู้เขียน ส่งไปที่อีเมลด้านล่าง",
    about_editorial_h2: "แนวทางบรรณาธิการของเรา",
    about_editorial_body:
      "ราคา ตารางเรือ และค่าเข้าชมมาจากแหล่งข้อมูลที่เผยแพร่ และแสดงเป็นช่วงราคา ทุกคู่มือแสดงวันที่อัปเดตล่าสุด หากเรายืนยันรายละเอียดใดไม่ได้ เราจะพยายามระบุไว้ หากพบข้อผิดพลาด โปรดอีเมลถึงเรา เราจะตรวจสอบและแก้ไขคู่มือ",
    about_partners_h2: "พาร์ทเนอร์ของเรา",
    about_partners_body:
      "ที่พัก: Booking.com (และ MakeMyTrip กับ Goibibo สำหรับผู้อ่านในอินเดีย) ทัวร์และตั๋ว: Klook, KKday, Tiqets, Go City และ Booking.com Attractions เที่ยวบิน: Aviasales และ Kiwi.com รถรับส่งและเช่ารถ: Welcome Pickups, Kiwitaxi, GetRentacar และ BikesBooking eSIM และซิม: Yesim, Airalo, Saily และ Drimsim ประกันและการเคลม: Ekta, AirHelp และ Compensair",
    about_status_h2: "อะไรใช้งานได้จริงและอะไรยังไม่ใช่",
    about_status_body:
      "การค้นหาโรงแรมจะพาคุณไปยังผลการค้นหาสดของ Booking.com รายการตัวอย่างในหน้าค้นหาของเราจะมีป้ายบอกว่าเป็นตัวอย่าง ระหว่างที่เรากำลังสร้างข้อมูลโรงแรมของเราเอง คู่มืออัปเดตเมื่อราคาและกฎเปลี่ยน แต่อาจล้าสมัยได้ โปรดดูวันที่อัปเดตที่ด้านบนของแต่ละคู่มือ",
    about_contact_h2: "ติดต่อเรา",
    about_contact_body_prefix: "มีคำถาม แจ้งแก้ไขข้อมูล หรือสนใจร่วมเป็นพาร์ทเนอร์? อีเมล ",
    about_disclaimer:
      "driftcoconut เป็นเว็บไซต์คู่มือท่องเที่ยวและแนะนำลูกค้าที่เป็นอิสระ ราคาและความพร้อมให้บริการมาจากพาร์ทเนอร์และเปลี่ยนแปลงบ่อย การจองและการชำระเงินทั้งหมดดำเนินการโดยพาร์ทเนอร์ เราไม่ใช่ตัวแทนท่องเที่ยว สายการบิน หรือบริษัทประกัน",

    // Footer
    footer_tagline: "คู่มือท่องเที่ยวเอเชียและที่พักที่แนะนำ",
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
    booking_card_body: "โรงแรม 2.3 ล้านแห่งทั่วโลก · ยกเลิกฟรีในหลายที่พัก (เงื่อนไขแตกต่างกัน) · การรับประกันราคาของ Booking.com",
    booking_card_cta: "ค้นหาโรงแรม →",

    // Guide tips badge (homepage callout)
    guide_tips_pill: "คู่มือเที่ยว",
    guide_tips_eyebrow: "เพิ่งเผยแพร่",
    guide_tips_featured_title: "คู่มือกรุงเทพฯ โดย driftcoconut",
    guide_tips_featured_teaser: "คำแนะนำจากคนในพื้นที่: พักที่ไหน ไปช่วงไหน อะไรควรข้าม — จากนักเขียนชาวกรุงเทพฯ",
    guide_tips_read_cta: "อ่านคู่มือ",
    guide_tips_see_all: "ดูคู่มือทั้งหมด",

    // Featured guides section (homepage funnel into written guide content)
    featured_guides_eyebrow: "เขียนโดยคนที่เคยไปมาจริง",
    featured_guides_title: "เริ่มต้นด้วยคู่มือ",
    featured_guides_subtitle: "ข้ามลิสต์ทั่วไป — ย่านจริง ราคาจริง ความเห็นจริง",
    featured_guides_cta: "ดูคู่มือทั้งหมด",

    // Mock-mode notice on search results
    search_mock_notice_title: "คุณกำลังดูรายการตัวอย่าง",
    search_mock_notice_body: "ระบบค้นหาโรงแรมสดของเราเร็วๆ นี้ สำหรับห้องพักจริงในเมืองนี้ ใช้ Booking.com ด้านล่างได้เลย — เราจะได้ค่าคอมมิชชั่นจากการจองของคุณ",
    search_booking_card_title_prefix: "โรงแรมจริงใน ",
    search_booking_card_body: "ดูห้องว่างและราคาจริงจากโรงแรม 2.3 ล้านแห่งบน Booking.com",

    // Site-wide FTC disclosure (footer)
    footer_ftc_disclosure:
      "driftcoconut เข้าร่วมโปรแกรมพันธมิตรกับ Booking.com, MakeMyTrip, Goibibo, Klook, KKday, Tiqets, Go City, Airalo, Yesim, Saily, Drimsim, Welcome Pickups, Kiwitaxi, GetRentacar, BikesBooking, Aviasales, Kiwi.com, Ekta, AirHelp และ Compensair เราอาจได้รับค่าคอมมิชชั่นเมื่อคุณจองหรือซื้อผ่านลิงก์ของเรา โดยคุณไม่ต้องจ่ายเพิ่ม",

    // Language toggle
    lang_toggle_aria: "เปลี่ยนภาษา",
  },

  zh: {
    // Header + nav
    nav_deals: "优惠",
    nav_about: "关于我们",
    nav_search_aria: "搜索",
    header_search_placeholder: "去哪儿?试试巴厘岛或东京...",
    header_search_aria: "搜索目的地",

    // Hero
    hero_title: "像懂行的人一样玩转亚洲",
    hero_subtitle: "真诚的本地指南、街区攻略，以及可一站式预订的酒店。",

    // Deals section
    deals_eyebrow: "为漫游者精选",
    deals_title: "下一站漂流去哪里",
    deals_tropical_title: "热带海岛",
    deals_tropical_desc: "巴厘岛、普吉岛、马尔代夫",
    deals_city_title: "城市假期",
    deals_city_desc: "东京、新加坡、香港",
    deals_mountain_title: "山间静修",
    deals_mountain_desc: "清迈、京都、沙巴",

    // Search form
    search_eyebrow: "准备预订了吗?",
    search_title: "搜索酒店",
    search_destination: "目的地",
    search_check_in: "入住",
    search_check_out: "退房",
    search_guests: "客人",
    search_submit: "搜索酒店",

    // Travel essentials — headings
    essentials_eyebrow: "旅行必备",
    essentials_default_heading: "完善您的旅程",
    essentials_default_sub: "出发前需要的一切 — 我们信赖的精选合作伙伴。",
    essentials_hotel_heading: "完善您的住宿",
    essentials_hotel_sub: "出发前需要的一切 — 我们信赖的精选合作伙伴。",
    essentials_about_heading: "全程规划您的旅行",
    essentials_about_sub: "除了酒店 — 我们推荐的经过精挑细选的旅行合作伙伴。",
    essentials_book_now: "立即预订",
    essentials_disclosure:
      "关联披露:driftcoconut 可能会在您通过这些合作伙伴预订时赚取少量佣金,您无需支付额外费用。",

    // Card titles
    card_klook_title: "预订旅游和体验",
    card_klook_sub: "免排队门票、烹饪课、一日游",
    card_welcomepickups_title: "机场接送",
    card_welcomepickups_sub: "接机服务,英语司机",
    card_yesim_title: "本地 eSIM 数据",
    card_yesim_sub: "落地即刻联网",
    card_kiwi_title: "比较航班",
    card_kiwi_sub: "多航空公司航线、隐藏城市票价",
    card_aviasales_title: "航班元搜索",
    card_aviasales_sub: "一次搜索扫描 100+ 航空公司和 OTA",
    card_airalo_title: "Airalo 全球 eSIM",
    card_airalo_sub: "200+ 国家,落地前安装",
    card_ekta_title: "旅行保险",
    card_ekta_sub: "医疗、行李、行程取消保障",
    card_airhelp_title: "航班延误退款",
    card_airhelp_sub: "延误或取消最高可索赔 €600",
    card_drimsim_title: "Drimsim 实体 SIM 卡",
    card_drimsim_sub: "偏好实体 SIM 卡?190+ 国家可用",
    card_tiqets_title: "Tiqets 景点门票",
    card_tiqets_sub: "全球博物馆、地标和免排队门票",
    card_hot_badge: "热门",
    card_alt_badge: "备选",

    // Trip planner
    plan_eyebrow: "行程规划",
    plan_heading: "一步步规划您的旅行",
    plan_heading_dest: "一步步规划您的{dest}之旅",
    plan_sub: "什么时候该准备什么:从预订、落地到顺利回家。",
    plan_urgency_label: "您什么时候出发?",
    plan_urgency_week: "本周",
    plan_urgency_month: "一个月内",
    plan_urgency_later: "更晚",
    plan_do_first: "优先办理",
    plan_also: "另可选择",
    plan_s1_title: "出发前",
    plan_s1_sub: "按您出发日期的紧急程度排序。",
    plan_s2_title: "落地后",
    plan_s2_sub: "从机场到酒店,不必讨价还价。",
    plan_s3_title: "旅途中",
    plan_s3_sub: "值得提前预订的门票和一日游。",
    plan_s4_title: "遇到问题时",
    plan_s4_sub: "延误、取消和理赔,出发前先了解。",
    plan_hotels_title: "查找酒店",
    plan_hotels_dest_title: "{dest}酒店",
    plan_hotels_sub: "在 Booking.com 比较住宿,并参考我们指南中的街区建议",
    plan_transfer_dest_title: "{dest}机场接送",
    plan_tours_dest_title: "{dest}旅游和一日游",
    plan_claim_title: "保险理赔协助",
    plan_claim_sub: "已有保障?查看保单,并向您的保险公司发起理赔。",
    plan_cars_title: "租车",
    plan_cars_sub: "比较租车公司并提前预订",
    plan_attractions_title: "Booking.com 景点门票",
    plan_attractions_sub: "来自您常用的 Booking.com 的门票和旅游产品",
    plan_compensation_title: "航班赔偿查询",
    plan_compensation_sub: "航班延误、取消或超售?查看您是否可获赔偿",
    plan_bikes_title: "租踏板车或自行车",
    plan_bikes_sub: "比较当地踏板车和自行车租赁。请先确认驾照和保险",
    plan_gocity_title: "Go City 景点通票",
    plan_gocity_sub: "一张通票即可游览城市中的多个景点",
    plan_transfer_to_title: "前往{dest}的接送",
    plan_transfer_to_sub: "提前预订从抵达的机场、车站或码头出发的专车",

    // About page
    about_h1: "关于 driftcoconut",
    about_intro:
      "driftcoconut 是一个独立的亚洲旅行指南网站。我们撰写实用的指南,从泰国和巴厘岛开始,告诉您住在哪个街区、什么时候去、花费多少以及需要注意什么,帮助您放心地选择住宿。",
    about_what_h2: "指南是如何制作的",
    about_what_body:
      "每篇指南由常驻曼谷的作者 Mr. Padthai Jaidee 撰写,并参考已公开的资料来源,例如渡轮运营商、旅游主管部门、潜水和旅游运营商以及天气数据。价格仅为规划参考范围,并非实时报价,每篇指南都会标注最近更新日期。当您准备预订时,我们的链接会带您前往合作伙伴自己的网站(例如用于酒店的 Booking.com),您在那里完成预订和付款。我们不会看到或保存您的付款信息。",
    about_money_h2: "我们如何赚钱",
    about_money_body:
      "当您通过我们的部分链接预订或购买时,我们会获得佣金,您无需额外付费。我们先撰写指南,之后再加入链接。价格、签证规则和营业时间请仅作参考,出行前请向官方渠道核实。",
    about_author_h2: "谁在撰写指南",
    about_author_body:
      "Mr. Padthai Jaidee 在曼谷撰写 driftcoconut 的指南。他是一位泰国旅行者,只写自己熟悉的地方,并在每次更新前对照已公开的资料核实价格、时刻表和规定。如需联系作者,请使用下方邮箱。",
    about_editorial_h2: "我们的编辑方式",
    about_editorial_body:
      "价格、渡轮时间和门票费用来自已公开的资料,并以范围形式给出。每篇指南都标注最近更新日期。对于无法确认的细节,我们会尽量注明。如果您发现错误,请给我们发邮件,我们会核实并更正指南。",
    about_partners_h2: "我们的合作伙伴",
    about_partners_body:
      "酒店:Booking.com(印度读者另有 MakeMyTrip 和 Goibibo)。旅游和门票:Klook、KKday、Tiqets、Go City 和 Booking.com Attractions。机票:Aviasales 和 Kiwi.com。接送和租车:Welcome Pickups、Kiwitaxi、GetRentacar 和 BikesBooking。eSIM 和 SIM 卡:Yesim、Airalo、Saily 和 Drimsim。保险和理赔:Ekta、AirHelp 和 Compensair。",
    about_status_h2: "哪些已上线,哪些还没有",
    about_status_body:
      "酒店搜索会带您前往 Booking.com 的实时结果。在我们自建酒店数据期间,搜索页面上的任何示例列表都会标明为示例。指南会随价格和规则变化而更新,但也可能滞后,请查看每篇指南顶部的更新日期。",
    about_contact_h2: "联系我们",
    about_contact_body_prefix: "如有问题、更正或合作意向?邮件 ",
    about_disclaimer:
      "driftcoconut 是一个独立的旅行指南和推荐网站。价格和可订情况来自合作伙伴,且经常变化。所有预订和付款均由合作伙伴处理。我们不是旅行社、航空公司或保险公司。",

    // Footer
    footer_tagline: "亚洲旅行指南与住宿推荐。",
    footer_col_company: "公司",
    footer_col_legal: "法律",
    footer_col_partners: "合作伙伴",
    footer_link_contact: "联系",
    footer_link_privacy: "隐私",
    footer_link_terms: "条款",
    footer_copyright: "由关联合作伙伴提供支持。价格和房态可能变动。",

    // Booking.com CJ card
    booking_card_eyebrow: "关联合作伙伴",
    booking_card_title: "在 Booking.com 上找到您的住宿",
    booking_card_body: "230 万家住宿 · 许多住宿可免费取消(条款因住宿而异)· Booking.com 价格匹配保证。",
    booking_card_cta: "搜索酒店 →",

    // Guide tips badge (homepage callout)
    guide_tips_pill: "指南小贴士",
    guide_tips_eyebrow: "刚发布",
    guide_tips_featured_title: "driftcoconut 曼谷指南",
    guide_tips_featured_teaser: "本地人的推荐:住哪里、什么时候去、跳过什么 — 来自一位常驻曼谷的作者。",
    guide_tips_read_cta: "阅读指南",
    guide_tips_see_all: "查看全部指南",

    // Featured guides section (homepage funnel into written guide content)
    featured_guides_eyebrow: "由亲身去过的人撰写",
    featured_guides_title: "从一篇指南开始",
    featured_guides_subtitle: "跳过千篇一律的清单 — 真实的街区、真实的价格、真实的看法。",
    featured_guides_cta: "浏览全部指南",

    // Mock-mode notice on search results
    search_mock_notice_title: "您正在查看示例房源",
    search_mock_notice_body: "我们的实时酒店库存即将上线。在此城市查找真实可预订房间,请使用下方的 Booking.com — 我们将获得您的预订记账。",
    search_booking_card_title_prefix: "真实酒店 · ",
    search_booking_card_body: "查看 Booking.com 230 万家住宿的实时房态和价格。",

    // Site-wide FTC disclosure (footer)
    footer_ftc_disclosure:
      "driftcoconut 参与与 Booking.com、MakeMyTrip、Goibibo、Klook、KKday、Tiqets、Go City、Airalo、Yesim、Saily、Drimsim、Welcome Pickups、Kiwitaxi、GetRentacar、BikesBooking、Aviasales、Kiwi.com、Ekta、AirHelp 和 Compensair 的关联营销项目。您通过我们的链接预订或购买时,我们可能获得佣金,您无需支付额外费用。",

    // Language toggle
    lang_toggle_aria: "切换语言",
  },
} as const;

export type TranslationKey = keyof typeof dictionary["en"];
