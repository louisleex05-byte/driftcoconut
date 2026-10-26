import Image from "next/image";

// Per-guide slot → photo file + alt text.
// The MDX writes `<GuidePhoto slot="whenToGo" />` — this resolves the slot for the
// current guideSlug (defaulting to bangkok for backwards-compat).
//
// To add photos for a new guide: add a new entry keyed by that guide's slug, with
// slot names matching the <GuidePhoto slot="..." /> tags used in its MDX.

type PhotoEntry = {
  file: string;
  alt: string;
  portrait?: boolean;
  wide?: boolean;
  credit?: { author: string; source: string; license?: string; licenseUrl?: string };
};

const GUIDES: Record<string, Record<string, PhotoEntry>> = {
  bangkok: {
    hero:      { file: "hero.jpg",       alt: "Bangkok skyline at night with the Chao Phraya River in view" },
    whenToGo:  { file: "when-to-go.jpg", alt: "Songkran water festival celebration in the streets of Bangkok" },
    sukhumvit: { file: "sukhumvit.jpg",  alt: "BTS Skytrain running above Sukhumvit Road in Bangkok" },
    silom:     { file: "silom.jpg",      alt: "Rooftop bar overlooking Bangkok's Silom skyline at sunset" },
    riverside: { file: "riverside.jpg",  alt: "Longtail boat on the Chao Phraya River at dusk, Bangkok" },
    oldTown:   { file: "wat-pho-reclining-buddha-hall.jpg", alt: "Illustrative wide view of the reclining Buddha hall at Wat Pho", wide: true },
    activity:  { file: "activity.jpg",   alt: "Wat Arun temple silhouetted against sunset across the Chao Phraya" },
    localTips: { file: "local-tips.jpg", alt: "Street food vendor cooking pad thai at a Bangkok night market" },
    ariCafe: { file: "ari-cafe.jpg", alt: "Warmly lit café interior in Bangkok's Ari neighborhood", credit: { author: "bckfwd", source: "https://unsplash.com/photos/lighted-chandelier-inside-cafe-ifkd981FUdM", license: "Unsplash License", licenseUrl: "https://unsplash.com/license" } },
    yaowaratFood: { file: "yaowarat-food.jpg", alt: "Night food stall and pedestrians on Yaowarat Road", portrait: true, credit: { author: "Kaden Taylor", source: "https://unsplash.com/photos/nighttime-street-food-vendors-in-bangkok-k8dwH-poJ2c", license: "Unsplash License", licenseUrl: "https://unsplash.com/license" } },
    chatuchakAisle: { file: "chatuchak-aisle.jpg", alt: "Shoppers browsing a colorful covered aisle at Chatuchak Weekend Market", credit: { author: "Mussi Katz", source: "https://commons.wikimedia.org/wiki/File:Colorful_covered_alley_lined_with_clothing_and_souvenir_stalls_at_Chatuchak_Weekend_Market,_Bangkok.jpg", license: "CC0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/" } },
    thonburiCanal: { file: "thonburi-canal.jpg", alt: "Small boat beside houses along a quiet Thonburi canal", credit: { author: "David Broad", source: "https://commons.wikimedia.org/wiki/File:Bangkok_canals_Khlongs_in_the_Thon_Buri_district_-_panoramio_(8).jpg", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0/" } },
    grandPalaceCourtyard: { file: "grand-palace-courtyard.jpg", alt: "Visitors crossing a courtyard of Bangkok's Grand Palace", wide: true, credit: { author: "ErwinMeier", source: "https://commons.wikimedia.org/wiki/File:Bangkok_Gro%C3%9Fer_Palast_01.jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" } },
    expressBoatPier: { file: "express-boat-pier.jpg", alt: "Chao Phraya Express boat boarding at Sathorn Pier", credit: { author: "David McKelvey", source: "https://commons.wikimedia.org/wiki/File:Chao_Phraya_Express_Boat_Service,_Sathorn_Pier,_Bangkok_(6906973718).jpg", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/" } },
    rainyStreet: { file: "rainy-street.jpg", alt: "Wet Bangkok street with reflections and umbrellas during a rain shower", credit: { author: "Chainwit", source: "https://commons.wikimedia.org/wiki/File:Bangkok_-_Phahurat_in_the_rain_(2024)_-_img_10.jpg", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/" } },
    boatNoodles: { file: "boat-noodles.jpg", alt: "Bowl of Bangkok-style boat noodles at a local table", portrait: true, credit: { author: "Emppowering", source: "https://commons.wikimedia.org/wiki/File:Bowl_of_boat_noodles.jpg", license: "CC0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/" } },
    watPhoDetail: { file: "wat-pho-reclining-buddha-detail.jpg", alt: "Illustrative close view of the reclining Buddha at Wat Pho" },
    watPhoChedi: { file: "old-town.jpg", alt: "Temple hall and white chedi in Bangkok's Old Town", portrait: true },
  },
  "chiang-mai": {
    hero:        { file: "hero.jpg",         alt: "Doi Suthep golden temple overlooking Chiang Mai city at sunset" },
    whenToGo:    { file: "when-to-go.jpg",   alt: "Yi Peng lantern festival releasing sky lanterns over Chiang Mai" },
    oldCity:     { file: "old-city.jpg",     alt: "Chiang Mai Old City ancient moat and city wall" },
    nimman:      { file: "nimman.jpg",       alt: "Nimman coffee shop and cafe district in Chiang Mai" },
    riverside:   { file: "riverside.jpg",    alt: "Ping River teak houses at sunset in Chiang Mai" },
    nightBazaar: { file: "night-bazaar.jpg", alt: "Chiang Mai Night Bazaar and Anusarn Market stalls at night" },
    santitham:   { file: "santitham.jpg",    alt: "Santitham local Thai residential neighborhood in Chiang Mai" },
    doiSuthep:   { file: "doi-suthep.jpg",   alt: "Wat Phra That Doi Suthep temple with mountain view" },
    khaoSoi:     { file: "khao-soi.jpg",     alt: "Bowl of Northern Thai khao soi curry noodles in Chiang Mai" },
  },
  bali: {
    hero:         { file: "hero.jpg",          alt: "Tegallalang rice terraces in the Ubud hills of Bali" },
    whenToGo:     { file: "when-to-go.jpg",    alt: "Ogoh-ogoh effigy carried before Nyepi in Bali" },
    ogohOgoh2:    { file: "ogoh-ogoh-2.jpg",   alt: "Illuminated ogoh-ogoh figure during a Balinese Nyepi-eve procession", portrait: true },
    ogohOgoh3:    { file: "ogoh-ogoh-3.jpg",   alt: "Ogoh-ogoh procession through a Balinese street before Nyepi", portrait: true },
    ubud:         { file: "ubud.jpg",          alt: "Ubud rice terraces and jungle village in Bali" },
    canggu:       { file: "canggu.jpg",        alt: "Surfer at Batu Bolong beach in Canggu, Bali" },
    seminyak:     { file: "seminyak.jpg",      alt: "Seminyak beach club at sunset with cocktails on the sand" },
    seminyak2:    { file: "seminyak-2.jpg",    alt: "Cocktails served at a Seminyak beach club during sunset" },
    seminyak3:    { file: "seminyak-3.jpg",    alt: "Cocktail overlooking the beach at sunset in Seminyak", portrait: true },
    uluwatu:      { file: "uluwatu.jpg",       alt: "Uluwatu Temple perched on a cliff over the Indian Ocean at sunset" },
    kecak1:       { file: "kecak-1.jpg",        alt: "Kecak chorus performing in the open-air amphitheatre at Uluwatu Temple" },
    kecak2:       { file: "kecak-2.jpg",        alt: "Hanuman character performing during the Kecak dance at Uluwatu", portrait: true },
    kecak3:       { file: "kecak-3.jpg",        alt: "Kecak dancers seated around ceremonial flames during an evening performance" },
    kecak4:       { file: "kecak-4.jpg",        alt: "Fire performer carrying a torch during the Uluwatu Kecak dance", portrait: true },
    sanur:        { file: "sanur.jpg",         alt: "Traditional jukung boat launching at Sanur Beach, Bali", portrait: true },
    sanur2:       { file: "sanur-2.jpg",       alt: "Traditional jukung boat moored along Sanur Beach, Bali" },
    sanur3:       { file: "sanur-3.jpg",       alt: "Traditional jukung boats and morning visitors on Sanur Beach, Bali", portrait: true },
    nusaPenida:   { file: "nusa-penida.jpg",   alt: "Kelingking Beach T-Rex cliff view on Nusa Penida" },
    cookingClass: { file: "cooking-class.jpg", alt: "Balinese cooking class with fresh market ingredients" },
    warung:       { file: "warung.jpg",        alt: "Traditional Balinese warung serving nasi campur and babi guling" },
  },
  phuket: {
    hero:       { file: "hero.jpg",        alt: "Promthep Cape sunset viewpoint at the southern tip of Phuket" },
    whenToGo:   { file: "when-to-go.jpg",  alt: "Andaman coast red flag beach warning during monsoon season in Phuket" },
    kata:       { file: "kata.jpg",        alt: "Kata Beach family-friendly Andaman coast in Phuket at sunset" },
    bangTao:    { file: "bang-tao.jpg",    alt: "Bang Tao and Kamala luxury resort beach in northern Phuket" },
    oldTown:    { file: "old-town.jpg",    alt: "Sino-Portuguese saffron shophouses on Thalang Road in Phuket Old Town" },
    patong:     { file: "patong.jpg",      alt: "Patong Beach in daytime with longtail boats and busy sand strip" },
    bigBuddha:  { file: "big-buddha.jpg",  alt: "Big Buddha Wat Phra Yai marble statue overlooking Phuket bay" },
    phiPhi:     { file: "phi-phi.jpg",     alt: "Phi Phi Islands turquoise water and limestone cliffs day trip from Phuket" },
    khanomJeen: { file: "khanom-jeen.jpg", alt: "Southern Thai khanom jeen curry rice noodles with fresh vegetables" },
  },
  krabi: {
    hero:        { file: "hero.jpg",         alt: "Railay Beach limestone karst cliffs at sunset in Krabi Thailand" },
    whenToGo:    { file: "when-to-go.jpg",   alt: "Ao Nang beach town dry season sunset on Andaman coast Krabi" },
    aoNang:      { file: "ao-nang.jpg",      alt: "Ao Nang main beach strip longtail boats and restaurants Krabi" },
    railay:      { file: "railay.jpg",       alt: "Railay Beach peninsula rock climbing limestone cliffs and jungle Krabi" },
    nopparat:    { file: "nopparat.jpg",     alt: "Nopparat Thara Beach long quiet Andaman coast marine park Krabi" },
    krabiTown:   { file: "krabi-town.jpg",   alt: "Krabi Town riverside night market and Chao Fa pier southern Thailand" },
    phiPhi:      { file: "phi-phi.jpg",      alt: "Phi Phi Islands day trip Maya Bay turquoise water day trip from Krabi" },
    emeraldPool: { file: "emerald-pool.jpg", alt: "Emerald Pool Sa Morakot jungle spring in Khao Nor Chuchi Krabi" },
    khanomJeen:  { file: "khanom-jeen.jpg",  alt: "Southern Thai khanom jeen curry noodles with fresh vegetables Krabi" },
  },
  "mae-hong-son": {
    hero:          { file: "hero.jpg",           alt: "Pai valley at sunrise with mist over rice paddies and mountain backdrop in northern Thailand" },
    whenToGo:      { file: "when-to-go.jpg",     alt: "Ban Rak Thai Yunnanese Chinese tea village lake at dawn in cool season" },
    pai:           { file: "pai.jpg",            alt: "Pai Walking Street night market with hipster cafes and travelers in Mae Hong Son" },
    maeHongSon:    { file: "mae-hong-son.jpg",   alt: "Wat Chong Klang and Wat Chong Kham twin Burmese temples reflected in Chong Kham Lake" },
    banRakThai:    { file: "ban-rak-thai.jpg",   alt: "Ban Rak Thai Yunnanese Chinese tea plantation village on Myanmar border" },
    yunLai:        { file: "yun-lai.jpg",        alt: "Yun Lai viewpoint at dawn overlooking misty Pai valley in Mae Hong Son" },
    watChongKlang: { file: "wat-chong-klang.jpg", alt: "Wat Chong Klang Burmese-style temple on Chong Kham Lake in Mae Hong Son town" },
    localFood:     { file: "local-food.jpg",     alt: "Yunnanese steamed pork buns and hot tea breakfast at Ban Rak Thai" },
  },
  samui: {
    hero:         { file: "hero.jpg",          alt: "Bophut Fisherman's Village lantern-lit walking street in Koh Samui at dusk" },
    whenToGo:     { file: "when-to-go.jpg",    alt: "Ang Thong Marine Park emerald lagoon and limestone islands off Koh Samui" },
    bophut:       { file: "bophut.jpg",        alt: "Bophut Fisherman's Village boutique dinner strip on the north coast of Koh Samui" },
    choengMon:    { file: "choeng-mon.jpg",    alt: "Choeng Mon crescent beach with calm swimming water on Koh Samui's east tip" },
    chaweng:      { file: "chaweng.jpg",       alt: "Chaweng Beach main tourist strip and long sand strip on Koh Samui" },
    lamai:        { file: "lamai.jpg",         alt: "Lamai Beach and Hin Ta Hin Yai grandfather grandmother rock formations Koh Samui" },
    bigBuddha:    { file: "big-buddha.jpg",    alt: "Big Buddha Wat Phra Yai gold statue on Ko Fan islet Koh Samui" },
    angThong:     { file: "ang-thong.jpg",     alt: "Ang Thong National Marine Park limestone archipelago day trip from Koh Samui" },
    nathonMarket: { file: "nathon-market.jpg", alt: "Nathon fresh market grilled fish and Thai food stalls at dawn Koh Samui" },
  },
  pattaya: {
    hero:       { file: "hero.jpg",        alt: "Wongamat Beach at sunset with the Pattaya coastline in the background" },
    whenToGo:   { file: "when-to-go.jpg",  alt: "Songkran and Wan Lai water festival celebration in Pattaya" },
    wongamat:   { file: "wongamat.jpg",    alt: "Wongamat Beach at sunset with palms and family-friendly seafront in North Pattaya" },
    jomtien:    { file: "jomtien.jpg",     alt: "Jomtien Beach with tree shade and calm sand south of Pattaya" },
    pratamnak:  { file: "pratamnak.jpg",   alt: "Pratamnak Hill viewpoint over Pattaya Bay with Big Buddha Wat Phra Yai" },
    central:    { file: "central.jpg",     alt: "Central Pattaya beach and skyline near Central Festival mall" },
    sanctuary:  { file: "sanctuary.jpg",   alt: "Sanctuary of Truth all-teak temple by the sea in Pattaya" },
    kohLarn:    { file: "koh-larn.jpg",    alt: "Coral Island Koh Larn white sand beach and turquoise water day trip from Pattaya" },
    nongNooch:  { file: "nong-nooch.jpg",  alt: "Nong Nooch Tropical Botanical Garden with topiary and orchid houses" },
    fishMarket: { file: "fish-market.jpg", alt: "Naklua Fish Market grilled seafood and local Thai stalls at dawn" },
  },
  ayutthaya: {
    hero:              { file: "hero.jpg",                alt: "Wat Mahathat sandstone Buddha head entwined in banyan tree roots at Ayutthaya Historical Park" },
    whenToGo:          { file: "when-to-go.jpg",          alt: "Ayutthaya Historical Park Buddhist temple ruins during dry season sunset" },
    historicalPark:    { file: "historical-park.jpg",     alt: "Ayutthaya Historical Park UNESCO ancient capital ruins with reclining Buddha" },
    watMahathat:       { file: "wat-mahathat.jpg",        alt: "Wat Mahathat Buddha head embraced by fig tree roots in Ayutthaya" },
    watPhraSiSanphet:  { file: "wat-phra-si-sanphet.jpg", alt: "Wat Phra Si Sanphet three white chedis royal Buddhist temple Ayutthaya" },
    bangPaIn:          { file: "bang-pa-in.jpg",          alt: "Bang Pa-In Royal Summer Palace Thai gazebo on the lake near Ayutthaya" },
    nightBazaar:       { file: "night-bazaar.jpg",        alt: "Ayutthaya night market food stalls and evening dining on the island" },
    boatTrip:          { file: "boat-trip.jpg",           alt: "Longtail boat sunset river tour circling Ayutthaya historic island" },
    boatNoodles:       { file: "boat-noodles.jpg",        alt: "Ayutthaya boat noodles kuay tiew rue with dark beef broth street food" },
  },
  chiangrai: {
    hero:          { file: "hero.jpg",          alt: "Misty sunrise over Chiang Rai's mountain ridges with soft northern Thai light" },
    whenToGo:      { file: "when-to-go.jpg",    alt: "Giant white dragon sculpture at Wat Huay Pla Kang Nine-Tier Pagoda in Chiang Rai under clear cool-season sky" },
    neighborhood1: { file: "neighborhood1.jpg", alt: "Chiang Rai Clock Tower and Night Bazaar streets at dusk" },
    neighborhood2: { file: "neighborhood2.jpg", alt: "Kok River waterfront with a quiet riverside resort and tropical greenery" },
    activity:      { file: "activity.jpg",      alt: "Wat Rong Khun White Temple exterior and white naga lion guardian sculptures at Chiang Rai's mirrored temple complex" },
    doiTung:       { file: "doi-tung.jpg",       alt: "Mae Fah Luang Garden landscaped flower beds with mountain views at Doi Tung Royal Villa in Chiang Rai highlands" },
    localFood:     { file: "local-food.jpg",    alt: "Khao soi northern Thai curry noodles with pickled mustard greens and crispy noodles" },
  },
  "hua-hin": {
    hero: { file: "hero.jpg", alt: "Hua Hin beachfront promenade with fishing pier and royal beach town skyline at sunset" },
    whenToGo: { file: "when-to-go.jpg", alt: "Cool-season Hua Hin beach with calm Gulf of Thailand waves and blue skies November to February" },
    neighborhood1: { file: "neighborhood1.jpg", alt: "Hua Hin town centre with night market stalls and colonial railway station landmark" },
    neighborhood2: { file: "neighborhood2.jpg", alt: "Khao Takiab fishing village headland and temple with Gulf of Thailand views south of Hua Hin" },
    activity: { file: "activity.jpg", alt: "Horse riding on Hua Hin wide sandy beach at golden hour with palm trees" },
    waterfall: { file: "waterfall.jpg", alt: "Pa La-U Waterfall multi-tiered cascade in Kaeng Krachan National Park rainforest west of Hua Hin" },
    railway: { file: "railway.jpg", alt: "Hua Hin Railway Station iconic red and white Thai royal Victorian pavilion landmark architecture" },
    localFood: { file: "local-food.jpg", alt: "Grilled river prawns and fresh seafood at Dechanuchit night market Hua Hin" },
  },
  kanchanaburi: {
    hero: { file: "hero.jpg", alt: "Bridge over the River Kwai historic WWII memorial railway crossing in Kanchanaburi at sunset" },
    whenToGo: { file: "when-to-go.jpg", alt: "Cool-season Kanchanaburi jungle mist over River Kwai at dawn November to February dry weather" },
    riverKwai: { file: "river-kwai.jpg", alt: "Kwai Yai River floating raft houses and longtail boats with limestone jungle backdrop Kanchanaburi" },
    deathRailway: { file: "death-railway.jpg", alt: "Bridge over the River Kwai historic black iron truss and Death Railway train tracks with bomb memorial sculptures Kanchanaburi" },
    erawan: { file: "erawan.jpg", alt: "Erawan Falls seven-tier emerald turquoise cascade in Erawan National Park Kanchanaburi" },
    hellfirePass: { file: "hellfire-pass.jpg", alt: "Hellfire Pass Memorial Museum cutting through rock walls Thailand Burma railway WWII" },
    cemetery: { file: "cemetery.jpg", alt: "Kanchanaburi War Cemetery rows of Allied POW gravestones and manicured lawns memorial" },
    localFood: { file: "local-food.jpg", alt: "Grilled river fish yum pla duk foo and Thai curries served riverside on Kwai Yai Kanchanaburi" },
  },
  "koh-lanta": {
    hero: { file: "hero.jpg", alt: "Koh Lanta Long Beach Phra Ae sunset with longtail boats and palm silhouettes Andaman coast" },
    whenToGo: { file: "when-to-go.jpg", alt: "Cool dry-season Koh Lanta with calm Andaman sea and blue skies November to April" },
    neighborhood1: { file: "neighborhood1.jpg", alt: "Long Beach Phra Ae strip with beach bars restaurants and mid-range resorts Koh Lanta" },
    neighborhood2: { file: "neighborhood2.jpg", alt: "Kantiang Bay southern Koh Lanta boutique cliffside resorts and quiet horseshoe cove" },
    oldTown: { file: "old-town.jpg", alt: "Lanta Old Town wooden stilt shophouses and Sino-Portuguese Chinese fishing village heritage" },
    activity: { file: "activity.jpg", alt: "Snorkeling day trip to Koh Rok limestone islands and coral reefs from Koh Lanta" },
    waterfall: { file: "waterfall.jpg", alt: "Mu Ko Lanta National Park lighthouse cape jungle trails and viewpoint Koh Lanta" },
    localFood: { file: "local-food.jpg", alt: "Southern Thai seafood curry and grilled squid at Old Town riverfront restaurants Koh Lanta" },
  },
  "koh-chang": {
    hero: { file: "hero.jpg", alt: "Koh Chang White Sand Beach Hat Sai Khao sunset with palm trees and Gulf of Thailand" },
    whenToGo: { file: "when-to-go.jpg", alt: "Cool dry-season Koh Chang jungle interior with clear rivers November to April" },
    neighborhood1: { file: "neighborhood1.jpg", alt: "White Sand Beach Hat Sai Khao main tourist strip with beach bars and resorts Koh Chang" },
    neighborhood2: { file: "neighborhood2.jpg", alt: "Lonely Beach Bang Bao backpacker village and quieter south of Koh Chang" },
    jungle: { file: "jungle.jpg", alt: "Klong Plu Waterfall multi-tier jungle cascade in Mu Koh Chang National Park" },
    activity: { file: "activity.jpg", alt: "Bang Bao stilt fishing village pier and snorkeling boats to Koh Wai Koh Chang" },
    viewpoint: { file: "viewpoint.jpg", alt: "Kai Bae viewpoint Gulf of Thailand islands and elephant grass overlook Koh Chang" },
    localFood: { file: "local-food.jpg", alt: "Fresh Trat-province seafood and Thai curries at Bang Bao pier restaurants Koh Chang" },
  },
  "koh-phangan": {
    hero: { file: "hero.jpg", alt: "Sri Thanu west-coast beach on Koh Phangan with pale sand and calm water at golden hour" },
    whenToGo: { file: "when-to-go.jpg", alt: "Calm turquoise water and clear skies during Koh Phangan's dry season from February to April" },
    neighborhood1: { file: "neighborhood1.jpg", alt: "Thong Sala pier town with the ferry pier, Pantip Market food stalls, and scooter rental shops" },
    neighborhood2: { file: "neighborhood2.jpg", alt: "Sri Thanu west-coast cafes, yoga studios, and sunset bars near Zen Beach on Koh Phangan" },
    neighborhood3: { file: "neighborhood3.jpg", alt: "Haad Yao and Haad Salad pale-sand beaches with the Koh Ma sandbar on northwest Koh Phangan" },
    fullMoonParty: { file: "full-moon-party.jpg", alt: "Haad Rin Nok beach crowded with lights and fire shows during the Full Moon Party" },
    activity: { file: "activity.jpg", alt: "Longtail boat day trip through the limestone islands and lagoon of Ang Thong Marine Park" },
    waterfall: { file: "waterfall.jpg", alt: "Than Sadet waterfall and jungle rock pools on the quiet east coast of Koh Phangan" },
  },
  "koh-tao": {
    hero: { file: "hero.jpg", alt: "Sairee Beach Koh Tao at sunset with longtail boats moored along the sand" },
    whenToGo: { file: "when-to-go.jpg", alt: "Calm turquoise water at Sairee Beach with a dive boat heading out at sunrise" },
    neighborhood1: { file: "neighborhood1.jpg", alt: "Sairee Beach main strip on Koh Tao with dive shops, longtail boats, and beachfront bars" },
    neighborhood2: { file: "neighborhood2.jpg", alt: "Chalok Baan Kao quiet southern bay on Koh Tao with low-key dive resorts" },
    maeHaad: { file: "mae-haad.jpg", alt: "Mae Haad pier town on Koh Tao where ferries from Chumphon and Koh Phangan arrive" },
    activity: { file: "activity.jpg", alt: "Divers exploring a coral reef underwater off the coast of Koh Tao" },
    viewpoint: { file: "viewpoint.jpg", alt: "John-Suwan Viewpoint panoramic bay view from the southern tip of Koh Tao" },
    diveClass: { file: "dive-class.jpg", alt: "PADI Open Water students practicing diving skills in shallow water off Koh Tao" },
  },
  "cha-am": {
    hero:          { file: "hero.jpg",          alt: "Cha-am beach at sunset with rows of beach chairs and umbrellas along the sand" },
    whenToGo:      { file: "when-to-go.jpg",    alt: "Cha-am Beach Road quiet on a weekday morning with empty beach chairs and umbrellas" },
    neighborhood1: { file: "neighborhood1.jpg",  alt: "Cha-am Beach Road resorts and seafood restaurants lining the sand" },
    neighborhood2: { file: "neighborhood2.jpg",  alt: "Cha-am town center market near the train station with local food stalls" },
    activity:      { file: "activity.jpg",       alt: "Jet skiing and banana boat rides along Cha-am's beach road" },
    landmark:      { file: "landmark.jpg",       alt: "Maruekhathaiyawan Palace golden teak royal palace architecture near Cha-am" },
    kaengKrachan:          { file: "kaeng-krachan.jpg",          alt: "Kaeng Krachan National Park rainforest, waterfalls, and wildlife inland from Cha-am" },
    kaengKrachanWaterfall: { file: "kaeng-krachan-waterfall.jpg", alt: "Rainforest waterfall and emerald pool with smooth rocks in Kaeng Krachan National Park" },
    kaengKrachanMist:      { file: "kaeng-krachan-mist.jpg",      alt: "Morning mist over the Kaeng Krachan rainforest canopy with mountain ridges in the distance" },
    landmarkFront:         { file: "landmark-front.jpg",          alt: "Maruekhathaiyawan Palace raised teak pavilions with red-tiled roofs and blue shutters near Cha-am" },
    landmark2:             { file: "landmark2.jpg",               alt: "Maruekhathaiyawan Palace long covered seaside corridor with columns and ocean view" },
    activityJetski:        { file: "activity-jetski.jpg",         alt: "Jet ski riders and families wading in the shallows along Cha-am beach" },
    batCave:               { file: "bat-cave.jpg",                alt: "An estimated two million fruit bats emerging from a mountain cave near Cha-am at sunset" },
  },
  sukhothai: {
    songthaew:          { file: "songthaew.jpg",          alt: "Blue and white Old City to New City songthaew truck with driver at Sukhothai bus station" },
    whenToGo:           { file: "when-to-go.jpg",          alt: "Floating krathong offerings lit with candles and incense on water during Loy Krathong in Sukhothai" },
    neighborhood1:       { file: "neighborhood1.jpg",      alt: "Traditional teak guesthouse with carved wooden cart in Old Sukhothai near the Historical Park" },
    neighborhood2:       { file: "neighborhood2.jpg",      alt: "New Sukhothai street market stalls piled with fresh vegetables and local produce" },
    siSatchanalai:       { file: "si-satchanalai.jpg",     alt: "Wat Chang Lom bell-shaped chedi ringed by elephant buttresses at Si Satchanalai Historical Park" },
    sunsetRuins:         { file: "sunset-ruins.jpg",       alt: "Sukhothai Historical Park temple ruins lit at dusk and reflected in the lotus pond" },
    activity:            { file: "activity.jpg",           alt: "Weathered brick prang and standing Buddha niche at Wat Mahathat against a dramatic sky" },
    sunsetSilhouette:    { file: "sunset-silhouette.jpg",  alt: "Silhouetted seated Buddha statue, temple ruins, and palm tree against a purple and orange sunset sky" },
    oldTownGuesthouse:   { file: "old-town-guesthouse.jpg", alt: "Red teak guesthouse row on a quiet Old Sukhothai street near the Historical Park" },
  },
  pranburi: {
    hero: { file: "hero.jpg", alt: "Pranburi coastline with mangroves and limestone ridges along the Gulf of Thailand" },
    neighborhood1: { file: "neighborhood1.jpg", alt: "Pranburi Pak Nam Pran beachfront area neighborhood and accommodation options" },
    neighborhood2: { file: "neighborhood2.jpg", alt: "Pranburi Khao Kalok and southern Pak Nam Pran area neighborhood and accommodation options" },
    neighborhood3: { file: "neighborhood3.jpg", alt: "Pran Buri town and railway-station area" },
    pranBuriStation2: { file: "pran-buri-station-2.webp", alt: "Red-and-cream platform building at Pran Buri Railway Station" },
    huaHinStation: { file: "hua-hin-station.jpg", alt: "Historic red-and-cream platform at Hua Hin Railway Station" },
    pranBuriStation3: { file: "pran-buri-station-3.jpg", alt: "Pran Buri Railway Station entrance beneath a bright blue sky" },
    whenToGo: { file: "when-to-go.jpg", alt: "Pranburi When to go scenic view and travel destination photo" },
    activity: { file: "activity.jpg", alt: "Pranburi Things to do scenic view and travel destination photo" },
    samRoiYot: { file: "sam-roi-yot.jpg", alt: "Sam Roi Yot and Dolphin Bay limestone coast south of Pranburi" },
    dolphinBaySunset: { file: "dolphin-bay-sunset.jpg", alt: "Sunset over the wetlands and coastal bay south of Pranburi", portrait: true },
    coastalActivity: { file: "coastal-activity.jpg", alt: "Kiteboarding and water sports along the Pranburi coast" },
    kuiBuriNationalPark: { file: "kui-buri-national-park.jpg", alt: "Wild elephants grazing in Kui Buri National Park, Prachuap Khiri Khan" },
    phrayaNakhonCave: { file: "phraya-nakhon-cave.jpg", alt: "Kuha Karuhas pavilion illuminated inside Phraya Nakhon Cave" },
  },
  khanom: {
    hero: { file: "hero.jpg", alt: "Nai Phlao Beach and forested hills on the Khanom coast" },
    woodenResortCottages: { file: "wooden-resort-cottages.jpg", alt: "Traditional wooden resort cottages" },
    nadanResortAerial: { file: "nadan-resort-aerial.jpg", alt: "Aerial view of a beachfront resort" },
    neighborhood1: { file: "neighborhood1.jpg", alt: "Early light over Khanom's Gulf coast" },
    naiPhlaoResort: { file: "nai-phlao-resort.jpg", alt: "Palm-lined beachfront resort beneath green hills" },
    neighborhood2: { file: "neighborhood2.jpg", alt: "A small fishing boat at the mouth of Khlong Nai Phlao" },
    neighborhood3: { file: "neighborhood3.jpg", alt: "The white-and-gold Khanom City Pillar Shrine" },
    neighborhood4: { file: "neighborhood4.jpg", alt: "A waterside resort in Thong Nian on Khanom's quieter north coast" },
    whenToGo: { file: "when-to-go.jpg", alt: "Monsoon clouds and rough water on Khanom Beach", portrait: true },
    activity: { file: "activity.jpg", alt: "Rock pools at Hin Lat in Khlong Nai Phlao" },
    coastalParamotor: { file: "coastal-paramotor.jpg", alt: "Powered paraglider above coastal water", portrait: true },
    khanomCoast: { file: "khanom-coast.jpg", alt: "Palm-lined Gulf coastline with longtail boats" },
    thongYeeLongtail: { file: "thong-yee-longtail.jpg", alt: "Longtail boat beside a rocky Gulf cove" },
    localTips: { file: "local-tips.jpg", alt: "The temple hall at Wat Kradang-nga in Khanom" },
  },
  "khao-yai": {
    hero: { file: "hero.jpg", alt: "Mist and grassland viewed from an observation tower in Khao Yai National Park" },
    neighborhood1: { file: "neighborhood1.jpg", alt: "Blue local bus serving the Pak Chong approach to Khao Yai" },
    pakChongMarket: { file: "pak-chong-market.jpg", alt: "Pak Chong town and night market at dusk" },
    neighborhood2: { file: "neighborhood2.jpg", alt: "Green hills and grassland in the Khao Yai region" },
    regionalAccommodation: { file: "regional-accommodation.jpg", alt: "Modern accommodation building in the Khao Yai region at sunset" },
    neighborhood3: { file: "neighborhood3.jpg", alt: "Open grassland and park buildings in Khao Yai National Park" },
    mountainResort: { file: "mountain-resort.jpg", alt: "Mountain resort landscape in the Khao Yai region" },
    neighborhood4: { file: "neighborhood4.jpg", alt: "Reservoir and forest edge inside Khao Yai National Park" },
    whenToGo: { file: "when-to-go.jpg", alt: "Morning mist along a road in the Khao Yai region" },
    phaDiaoDai: { file: "pha-diao-dai.jpg", alt: "Pha Diao Dai viewpoint sign above the forested Khao Yai valley" },
    activity: { file: "activity.jpg", alt: "Haew Suwat Waterfall framed by a forest rock arch" },
    haewNarok: { file: "haew-narok.jpg", alt: "Haew Narok Waterfall viewed from the signed park lookout" },
    localTips: { file: "local-tips.jpg", alt: "Spicy Thai noodle soup served in the Khao Yai area" },
    pakChongFood: { file: "pak-chong-food.jpg", alt: "Grilled food stall at Pak Chong Night Market" },
    elephantSafety: { file: "elephant-safety.jpg", alt: "Wild elephant walking along a forest road in Khao Yai National Park" },
  },
  nan: {
    hero: { file: "hero.jpg", alt: "Standing Buddha at Wat Phra That Khao Noi overlooking Nan at sunset" },
    neighborhood1: { file: "neighborhood1.jpg", alt: "Wat Phumin illuminated by warm sunset light in Nan's historic centre" },
    neighborhood2: { file: "neighborhood2.jpg", alt: "Boutique accommodation in the Nai Wiang area of Nan" },
    neighborhood3: { file: "neighborhood3.jpg", alt: "Nan Provincial Bus Terminal on the southwestern side of town" },
    neighborhood4: { file: "neighborhood4.jpg", alt: "Nan De Panna Riverside Homestay east of the Nan River" },
    whenToGo: { file: "when-to-go.jpg", alt: "Garden and guest accommodation at Nan Seasons Boutique Resort" },
    activity: { file: "activity.jpg", alt: "Mountain bends on Route 1256 between Pua and Bo Kluea in Nan province" },
    localTips: { file: "local-tips.jpg", alt: "Mountain and cloud views from Doi Samer Dao in Nan province" },
    villaMahaphrom: { file: "villa-mahaphrom-hotel.jpg", alt: "Tree-shaded exterior of Villa Mahaphrom Hotel in Nan" },
    watSuanTan: { file: "wat-suan-tan.jpg", alt: "Red-and-gold temple hall at Wat Suan Tan in Nan" },
    doiSamerDaoSunrise: { file: "doi-samer-dao-sunrise.jpg", alt: "Sunrise over layered mountains and mist at Doi Samer Dao" },
  },
  "khao-kho": {
    hero: { file: "hero.jpg", alt: "Wind turbines across the Khao Kho hills at golden hour" },
    neighborhood1: { file: "neighborhood1.jpg", alt: "Curved-roof guest villas at Kiri Pura Resort in Khaem Son" },
    neighborhood2: { file: "neighborhood2.jpg", alt: "Wat Pha Sorn Kaew and hillside accommodation above a sea of mist" },
    neighborhood3: { file: "neighborhood3.jpg", alt: "Red post boxes at the Khao Kho Post Office viewpoint" },
    neighborhood4: { file: "neighborhood4.jpg", alt: "Sea-of-mist terrace at Mhork Buri Resort in Khao Kho" },
    whenToGo: { file: "when-to-go.jpg", alt: "Sunrise over the mist-filled valleys of Khao Kho" },
    activity: { file: "activity.jpg", alt: "Forest footbridge approaching Sri Dit Waterfall" },
    localTips: { file: "local-tips.jpg", alt: "A winding mountain road through Khao Kho's flower fields" },
    lushMountains: { file: "lush-green-mountains.jpg", alt: "Green Khao Kho mountain ridges after rain" },
    flowerFields: { file: "flower-fields.jpg", alt: "Purple flower fields on the cultivated slopes of Khao Kho" },
    campSonCabins: { file: "camp-son-cabins.jpg", alt: "Camp Son cabins overlooking a valley filled with morning mist" },
    dreamerVillas: { file: "dreamer-resort-villas.jpg", alt: "Pod-shaped villas at The Dreamer Resort Khao Kho" },
    hotelViewpointBalcony: { file: "hotel-viewpoint-balcony.jpg", alt: "A Khao Kho hotel balcony looking across a sea of mist" },
    sirinatiBanThungSamo: { file: "sirinati-ban-thung-samo.jpg", alt: "Sirinati Ban Thung Samo hotel amid the Khao Kho countryside" },
    nueaMekRoom: { file: "nuea-mek-family-room.jpg", alt: "Dome-shaped guest room at Nuea Mek Family Khao Kho" },
    watPhaSornKaew: { file: "wat-pha-sorn-kaew.jpg", alt: "The five white Buddhas and mosaic terraces of Wat Pha Sorn Kaew" },
    watPhaSornKaewSunrise: { file: "wat-pha-sorn-kaew-sunrise.jpg", alt: "Wat Pha Sorn Kaew illuminated by sunrise over the mountains" },
    mountainCafe: { file: "mountain-cafe-terrace.jpg", alt: "Bamboo café terrace facing the green mountains of Khao Kho" },
    seaOfMistViewpoint: { file: "sea-of-mist-viewpoint.jpg", alt: "Visitors watching sunrise above the Khao Kho sea of mist" },
  },
  "khao-sok-cheow-lan-lake": {
    hero: { file: "hero.jpg", alt: "Aerial sunrise over the islands and limestone ridges of Cheow Lan Lake" },
    whenToGo: { file: "when-to-go.jpg", alt: "Rainy-season mist settling over the Khao Sok rainforest" },
    activity: { file: "activity.jpg", alt: "Limestone formations inside Pakarang Cave" },
    localTips: { file: "local-tips.jpg", alt: "Floating raft houses on Cheow Lan Lake at sunrise" },
    landmark: { file: "landmark.jpg", alt: "Khao Sam Kloe limestone pillars rising from Cheow Lan Lake" },
    localFood: { file: "local-food.jpg", alt: "A street-food stall at Khao Sok Market" },
    transport: { file: "transport.jpg", alt: "Long-tail boats at the Cheow Lan Lake pier" },
    sunset: { file: "sunset.jpg", alt: "Golden sunbeams falling across Cheow Lan Lake's karsts" },
    fieryKarstsBoat: { file: "fiery-karsts-boat.jpg", alt: "A long-tail boat framed by limestone cliffs beneath a vivid sky" },
    boatFacingSunset: { file: "boat-facing-sunset.jpg", alt: "View from a long-tail boat facing the sunset on Cheow Lan Lake" },
    motorbikeRoad: { file: "khao-sok-road-motorbike.jpg", alt: "A motorbike beside the road through Khao Sok's limestone landscape" },
    sharedMinivan: { file: "shared-minivan-transfer.jpg", alt: "Passengers boarding a shared minivan in Surat Thani" },
    grilledFish: { file: "surat-thani-grilled-fish.jpg", alt: "Grilled fish on display at a Surat Thani street stall" },
    khanomJeen: { file: "southern-khanom-jeen.jpg", alt: "Southern khanom jeen rice noodles served with several curries" },
    watThamPhanthurat: { file: "wat-tham-phanthurat.jpg", alt: "Wat Tham Phanthurat against Khao Sok's limestone hills" },
    villageStreet: { file: "khao-sok-village-street.jpg", alt: "The main road through Khao Sok Village" },
    raftHouseBoats: { file: "raft-houses-and-boats.jpg", alt: "Long-tail boats moored beside floating houses on Cheow Lan Lake" },
    boatThroughKarsts: { file: "boat-through-karsts.jpg", alt: "View from a long-tail boat passing limestone karsts on Cheow Lan Lake" },
    clearBlueSkyLake: { file: "clear-blue-sky-lake.jpg", alt: "A clear blue sky above Cheow Lan Lake's green water and limestone cliffs" },
    kayakingRaftHouses: { file: "kayaking-raft-houses.jpg", alt: "Kayakers paddling beside floating bungalows" },
    mistyMorningBoat: { file: "misty-morning-boat.jpg", alt: "A long-tail boat facing mist-covered hills at dawn" },
    sunriseBeamsBoat: { file: "sunrise-beams-boat.jpg", alt: "Sunlight reaching a boat between Cheow Lan Lake's limestone walls" },
  },
};

export default function GuidePhoto({
  slot,
  guideSlug = "bangkok",
  caption,
}: {
  slot: string;
  guideSlug?: string;
  caption?: string;
}) {
  const guide = GUIDES[guideSlug];
  if (!guide) return null; // No entry for this guide — render nothing, never fall back to another guide's photos
  const meta = guide[slot];
  if (!meta) return null;
  return (
    <figure className="my-8 not-prose">
      <div className={`relative w-full ${meta.portrait ? "aspect-[3/4]" : meta.wide ? "aspect-[2/1]" : "aspect-[4/3]"} overflow-hidden rounded-2xl shadow-md`}>
        <Image
          src={`/guides/${guideSlug}/${meta.file}`}
          alt={caption ?? meta.alt}
          fill
          sizes="(max-width: 768px) 100vw, 720px"
          className={meta.portrait ? "object-contain bg-slate-100" : "object-cover"}
        />
      </div>
      <figcaption className="mt-2 text-xs text-slate-500 italic">
        {caption ?? meta.alt}
        {meta.credit && (
          <span className="ml-1 not-italic">
            — <a href={meta.credit.source} target="_blank" rel="noopener noreferrer" className="underline">{meta.credit.author}</a>
            {meta.credit.license && meta.credit.licenseUrl && (
              <> · <a href={meta.credit.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline">{meta.credit.license}</a></>
            )}
            {meta.credit.license?.startsWith("CC BY") && " · resized"}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
