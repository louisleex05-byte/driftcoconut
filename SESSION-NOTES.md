# driftcoconut — Full Session Notes

**Session date:** August 3, 2026
**Owner:** Niphon Srisawat (Louis Leex / louisleex05@gmail.com)
**Live site:** https://driftcoconut.com
**GitHub repo:** https://github.com/louisleex05-byte/travel-site
**Vercel project:** driftcoconut

---

## 1. Project overview

A Next.js 15 travel site that discovers and compares hotels across Asia-Pacific destinations, monetized through multiple affiliate partnerships. Built end-to-end in one working session — from research to live custom domain with 5 already-earning affiliate integrations, and 20+ additional applications in various stages.

**Positioning:** independent hotel discovery for English-speaking leisure travelers (25–55) planning tropical getaways, city breaks, and cultural trips across Asia-Pacific.

**Tech stack:**
- Next.js 15 (App Router, React 19, Server Components)
- TypeScript, Tailwind CSS with custom `sea` palette + Fraunces display serif
- Vercel hosting (Hobby plan) with auto-deploy on push
- Cloudflare DNS (free plan) — nameservers: alan.ns.cloudflare.com + dina.ns.cloudflare.com
- Z.com domain registrar

---

## 2. All affiliate programs — full status matrix

### ✅ APPROVED (5) — tracked links live on site

| Platform | Program | Reward | Cookie | Tracked link |
|---|---|---|---|---|
| Travelpayouts | **Klook** | 8% hotels, 10% tours | 7–30 days | klook.tpk.mx/nsmgv9sX |
| Travelpayouts | **Yesim** (eSIM) | 18% | 90 days | yesim.tpk.mx/3oNaHk4h |
| Travelpayouts | **Welcome Pickups** | 8–9% | 45 days | tpk.mx/1lwxsIoN |
| Travelpayouts | **Kiwi.com** | 3% + €1.5 | 30 days | kiwi.tpk.mx/tQAy1nbS |
| Travelpayouts | **Drimsim** (SIM) | €8 fixed | 90 days | drimsim.tpk.mx/bVdli8RO |

### ⏳ PENDING APPLICATIONS

| Platform | Program | Notes |
|---|---|---|
| CJ Affiliate | Booking.com regional (6 more) + Trip.com, Accor CN, IHG AMEA, Kayak, Momondo, Vrbo | 7 pending — CJ now activated |
| Awin | Lebua Hotels (Global) | Pending review — Awin currently on pause |
| Awin | Chatrium Hotels (Global) | Pending review — Awin currently on pause |

### ❌ DECLINED / BLOCKED

| Platform | Program | Reason | Retry |
|---|---|---|---|
| **Agoda (direct)** | **driftcoconut.com** | **REJECTED 8/20/2026 — boilerplate reasons (likely "site under construction" / "thin content"). Reconsideration ticket submitted 8/28.** | **Wait 3–7 days for support reply; if no reversal, reapply after 90-day cooldown (~ late Nov 2026) with destination guides + traffic** |
| Awin | Viator US | "Dead URL, page not found" | Retry in 3–4 days |
| Awin | Viator AU | "Advertiser doesn't work with this publisher type" | Try Viator UK/DE instead |
| Travelpayouts | Booking.com | Traffic requirement (3+ months) | Reapply Nov 2026 |
| Travelpayouts | 19 other premium programs | Same traffic reason | Reapply Nov 2026 |

### 🔴 BLOCKERS TO RESOLVE

| Blocker | Impact | Fix |
|---|---|---|
| **CJ Superuser login** | Payment info locked, can't activate CJ | Log in with `louisleex@hotmail.com` (Superuser), not gmail (Operator) |
| **Payoneer KYC pending** | No US routing/account numbers yet | Wait 1–3 business days; check email for doc requests |
| **Partnerize login** | Can't apply to Expedia/Hotels.com/Vrbo | Try `louisleex` all lowercase or reset password |
| **Agoda application rejected** | Direct affiliate blocked until reapproval — no Agoda inventory or commissions | (a) Wait for reconsideration ticket reply (3–7 days); (b) If denied, build 5–8 destination guides + earn some organic traffic, reapply after 90-day cooldown |

---

## 3. Recommended NEXT applications on Travelpayouts

Top 6 to apply for (all fit driftcoconut's Asia-Pacific focus):

1. **GetYourGuide** — 8% tours (global, complements Klook's Asia focus)
2. **Trip.com** — 1–5.5% Asian OTA (hotels + flights + trains)
3. **AirHelp** — 15–16.6% flight compensation leads
4. **Airalo** — 12% eSIM (Yesim backup)
5. **DiscoverCars** — 23–54% + **365-day cookie** (car rentals)
6. **Hostelworld** — 40% rev share (budget accommodations)

---

## 4. Site structure — full page-by-page breakdown

### Home page (`app/page.tsx`)

New ordering (browse-first, action-second) shipped this session:

```
1. HERO (rotating 6-photo panorama)
2. PARTNER STRIP (attached — Agoda, Booking, Expedia, Hotels.com, Viator/Tripadvisor Group)
3. WHERE TO DRIFT NEXT (Tropical / City / Mountain cards) ← MOVED UP
4. SEARCH HOTELS (refined typography, smaller labels) ← MOVED DOWN
5. TRAVEL ESSENTIALS (Klook / Welcome Pickups / Yesim+Drimsim / Kiwi)
6. Ambient palm + coral decorations (fixed to viewport corners)
```

### Header (`app/layout.tsx`)

- Coconut logo (48/56/64px across breakpoints) — dominant over wordmark
- "driftcoconut" wordmark in Fraunces serif, sea-700, text-lg → text-2xl responsive
- HeaderSearch component: magnify glass + input with smart routing to matched cities
- Mobile: magnify icon replaces text search field
- Nav: Deals / About (Search hidden on mobile — replaced by icon)

### Hotel detail page (`app/hotel/[id]/page.tsx`)

- 5-photo gallery grid
- Star rating + review score badge
- Description + amenities + available rooms
- Sticky "Book on Agoda" sidebar (uses affiliate landing URL)
- **NEW:** TravelEssentials section at bottom ("Complete your stay")

### About page (`app/about/page.tsx`)

- Full content with corner decorations
- **NEW:** TravelEssentials section at bottom ("Plan your trip end-to-end")

### Search results (`app/search/page.tsx`)

- Server-rendered grid
- Uses mockHotels while AGODA_MOCK=true

### Legal pages (`app/privacy/page.tsx`, `app/terms/page.tsx`)

Complete GDPR/FTC-compliant text. All email addresses updated to `hello@driftcoconut.com`.

---

## 5. File structure (current state)

```
Travel Site/
├── app/
│   ├── layout.tsx              # Header (logo, wordmark, HeaderSearch, nav) + footer + Travelpayouts Drive script
│   ├── page.tsx                # Home: Hero → Partners → Deals → Search → TravelEssentials
│   ├── globals.css             # Fraunces font import + root font-size scaling +20%
│   ├── icon.svg                # Favicon (coconut palm)
│   ├── apple-icon.svg          # iOS home screen icon
│   ├── about/page.tsx          # About + TravelEssentials
│   ├── privacy/page.tsx        # Privacy policy
│   ├── terms/page.tsx          # Terms of use
│   ├── search/page.tsx         # Server-rendered results grid + corner accents
│   ├── hotel/[id]/page.tsx     # Photo gallery + booking + TravelEssentials
│   └── api/agoda/search/route.ts   # JSON API proxy
├── components/
│   ├── Hero.tsx                # Rotating panoramic hero (6 photos, 7-sec fade)
│   ├── SearchForm.tsx          # Compact form (uppercase labels, sm text)
│   ├── HeaderSearch.tsx        # Magnify-glass input with smart routing
│   ├── HotelCard.tsx           # Grid tile with photo + affiliate link
│   ├── PartnerStrip.tsx        # Trust bar: agoda, Booking.com, Expedia, Hotels.com, Viator (by Tripadvisor Group)
│   ├── TravelEssentials.tsx    # 4-card affiliate cross-sell + Drimsim stacked under Yesim
│   ├── Logo.tsx                # Coconut palm SVG
│   └── Decorations.tsx         # 10+ tropical SVGs: PalmLeaf, Shell, Pebble, Wave, Hibiscus, Starfish, Boat, StrawHat, Coral, Conch
├── lib/
│   ├── agoda.ts                # Typed API client (with AGODA_MOCK fallback)
│   ├── cities.ts               # 47 cities grouped by region
│   ├── heroPhotos.ts           # 6-photo rotating hero config
│   ├── mockHotels.ts           # Sample hotels + detail data
│   └── affiliateLinks.ts       # Centralized Travelpayouts tracked URLs (5 partners)
├── public/
│   └── hero/                   # 7 panoramic photos (6 in rotation + 1 spare)
│       ├── bali-sanur.jpg
│       ├── maldives-overwater.jpg
│       ├── maldives-pool.jpg
│       ├── maldives-hammock.jpg
│       ├── maldives-dhoni.jpg
│       ├── maldives-palm-beach.jpg
│       └── maldives-beach.jpg (spare)
├── DEPLOY.md                   # Cloudflare + Vercel deployment guide
├── README.md                   # Project overview
├── SESSION-NOTES.md            # This file
├── package.json                # Project name: "driftcoconut"
├── tailwind.config.ts          # Custom `sea` palette + Fraunces
├── next.config.js              # Image domain allowlist
├── tsconfig.json               # TypeScript config
├── vercel.json                 # Framework hint + Singapore region
└── .env.example                # Env var template
```

---

## 6. Environment variables (set in Vercel dashboard)

| Name | Current value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://driftcoconut.com` | Used for OG tags, metadata |
| `AGODA_MOCK` | `true` | Serves sample hotels until Agoda approves |
| `AGODA_SITE_ID` | *(blank)* | Fill once Agoda approves (their CID) |
| `AGODA_API_KEY` | *(blank)* | Fill once Agoda approves |
| `NEXT_PUBLIC_AGODA_VERIFICATION` | *(blank)* | Fill if Agoda provides meta tag verification |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | *(blank)* | Fill after Google Search Console setup |
| `NEXT_PUBLIC_TRAVELPAYOUTS_SRC` | *(optional)* | If empty, falls back to `https://emrld.ltd/NTYxMTY4.js?t=561168` |

---

## 7. Commands reference

### Local development
```bash
cd "C:\Users\Admin\Downloads\Travel Site"
npm install
npm run dev
# → http://localhost:3000
```

### Deploy changes
```bash
git add -A
git commit -m "your change"
git push
# → live at driftcoconut.com in ~30 seconds (auto-deploy)
```

### Fix stuck git lock (Windows sandbox quirk)
```bash
del ".git\HEAD.lock" 2>nul
del ".git\index.lock" 2>nul
```

### Manual Vercel deploy
```bash
vercel --prod
```

### Cloning to laptop (continue session)
```bash
git clone https://github.com/louisleex05-byte/travel-site.git
cd travel-site
npm install
cp .env.example .env.local
# → then paste real values from Vercel Environment Variables
npm run dev
```

---

## 8. Design system

### Seawater palette (custom Tailwind `sea` ramp)

| Token | Hex | Use |
|---|---|---|
| `sea-50` | `#F0F9FB` | Softest tint (page bg gradient) |
| `sea-100` | `#DAF0F5` | Card borders, dividers |
| `sea-200/300` | `#B8E1EB` / `#85CBDB` | Input borders, ripples |
| `sea-400/500` | `#4FAFC5` / `#2A93AB` | Icons, focus rings |
| `sea-600/700` | `#1E7A91` / `#1A6377` | Buttons, links, prices |
| `sea-800/900` | `#194F5F` / `#0F3541` | Headings |

### Typography
- **Wordmark & headings:** Fraunces (display serif, Google Fonts)
- **Body:** system sans-serif
- **Root font-size:** 115% → 118% → 120% (mobile → tablet → desktop) = ~20% larger than default
- **Search form labels:** `text-[10px] uppercase tracking-wider text-slate-500` (small caps style)

### Decorations (in `components/Decorations.tsx`)
10 SVG components using `currentColor` so Tailwind `text-*` tints them:
- **PalmLeaf, Shell, Pebble, Wave, Hibiscus, Starfish, Boat, StrawHat, Coral, Conch**
- Placed at opacity 40–70% across all pages
- Fixed viewport-corner accents drift as user scrolls
- Hidden on mobile (`hidden md:block`) to reduce clutter

---

## 9. What changed in Session Part 2 (post-domain-setup)

Everything after custom domain went live:

1. **Header search bar** — magnify glass icon + input with smart city-name matching → direct route to `/search` results, or scroll to search form
2. **Reorder home** — Hero → Partners → Deals ("Where to drift next") → Search → TravelEssentials
3. **Search form typography refined** — uppercase micro-caps labels (`text-[10px]`), smaller inputs, tighter padding
4. **Logo scaling** — 48/56/64 px across breakpoints (dominant over wordmark)
5. **PartnerStrip restructure** — Tripadvisor → **Viator (By Tripadvisor Group)** with "Alternative" pill; parent brand credits pattern
6. **Travelpayouts integration** — 5 approved programs, tracked links live on 3 pages
7. **TravelEssentials component** — 4-card grid + Drimsim stacked as full card under Yesim (with "Alternative" badge)
8. **Travelpayouts Drive script** — added via `next/script` to unlock TP dashboard access
9. **Affiliate disclosure** — FTC-compliant italic text below every affiliate section

---

## 10. Priority action list (RESUME HERE ON LAPTOP)

### 🚨 Priority 1 — Agoda: REJECTED, appeal in progress
- **Application was REJECTED 8/20/2026** with boilerplate reasons (site under construction / thin content)
- Reconsideration ticket submitted 8/28/2026 via `partners.agoda.com` support form → routed to Affiliate Partnerships Team
- Expected reply: 3–7 business days
- If no reversal: plan to reapply after 90-day cooldown (late Nov 2026) with strengthened site (destination guides + organic traffic)
- Site UI already cleaned up: "Book on Agoda" button REPLACED with Booking.com CTA; Agoda removed from partner strip, footer, and About page
- Expected reply: 3–5 business days
- Their response will do one of: approve, ask for more info, decline

### 🚨 Priority 2 — Fix CJ Superuser login (blocking $$$)
- Log out of gmail (Operator) account
- Log in with `louisleex@hotmail.com` (Superuser)
- Reset password if needed via "Forgot Password"
- Complete Payment Information with Payoneer USD details
- Click ACTIVATE ACCOUNT → 7 Booking.com applications start processing

### 🚨 Priority 3 — Wait for Payoneer full approval
- Check Gmail daily for verification doc requests
- Once approved → get US routing + account numbers → use in CJ + Travelpayouts

### Priority 4 — Fix Partnerize login
- Username: `louisleex` (all lowercase)
- If fails: "Forgotten login details" reset flow
- Then apply to Expedia + Hotels.com + Vrbo

### Priority 5 — Apply to remaining Travelpayouts programs
- GetYourGuide, Trip.com, AirHelp, Airalo, DiscoverCars, Hostelworld
- ~2 min each, all likely to auto-approve given you already have 5 approved

### Priority 6 — Content + traffic building
- Write 3–5 destination guides (Bali, Bangkok, Tokyo, Maldives)
- Set up Google Analytics 4 + Search Console
- Set up hello@driftcoconut.com via Cloudflare Email Routing (free, 5 min)
- Instagram/Pinterest @driftcoconut posting weekly
- Reddit contributions in r/travel, r/solotravel

### Priority 7 — More hero photos
- Add Tokyo, Chiang Mai, Sapa, etc. from Pixabay/Unsplash/Pexels
- Save to `public/hero/` folder
- Add entries to `lib/heroPhotos.ts`

---

## 11. Support contacts

| Platform | Support channel | Notes |
|---|---|---|
| **Agoda Affiliate** | Dashboard → Submit Ticket | Just submitted — WAIT for reply |
| Agoda general | `partnersupport@agoda.com` | Wrong team; routes to Customer Experience Group |
| CJ Affiliate | `publishersupport@cj.com` | For Superuser role transfer if hotmail login lost |
| Awin | Support ticket via Awin dashboard | For rejections + questions |
| Partnerize | `support@partnerize.com` | For login reset |
| Payoneer | In-app chat / `support@payoneer.com` | For KYC status |
| Vercel | Community forum + docs | Rare need — everything works |
| Cloudflare | Community forum + docs | Rare need — everything works |
| Travelpayouts | Dashboard help center | For any program-specific questions |

---

## 12. Key learnings from this session

- **Domain propagation takes hours.** Even with correct nameservers, DNS updates worldwide slowly. Be patient.
- **Cloudflare Proxy breaks Vercel HTTPS.** Always use DNS-only (grey cloud) for Vercel origins.
- **Affiliate approvals take 1–4 weeks** for premium travel brands. 24-hour approvals are rare.
- **CJ has role hierarchy.** Operator ≠ Superuser. Payment info edits require Superuser.
- **Payoneer is the payment infrastructure for Thai publishers.** Native Thai bank SWIFT details don't validate on US networks. Payoneer's US routing/account works everywhere.
- **Text logos are safer than official images** until each affiliate approves you. Text-styled brand names in brand colors = zero trademark risk.
- **Photo licenses matter.** Pixabay + Unsplash are safe for free commercial use. Agoda API photos can only be used alongside Agoda booking widgets.
- **Traffic is the #1 requirement** for premium OTA affiliate programs (Booking, Expedia, Tripadvisor main). Content sites without 3+ months of traffic get auto-declined.
- **Support routing errors are common.** General support inboxes route to wrong departments. Use in-dashboard tickets to hit the right team directly.
- **Browse-first UX beats search-first** for discovery brands. Moving "Where to drift next" above "Search hotels" aligns with the coconut/drift aesthetic.

---

## 13. Reference URLs

- **Live site:** https://driftcoconut.com
- **Vercel dashboard:** https://vercel.com/sometum-deedee-s-projects/driftcoconut
- **GitHub repo:** https://github.com/louisleex05-byte/travel-site
- **Cloudflare dashboard:** https://dash.cloudflare.com → driftcoconut.com
- **Agoda Partners:** https://partners.agoda.com
- **CJ Affiliate:** https://members.cj.com
- **Awin:** https://ui.awin.com (Publisher ID 3018153)
- **Partnerize:** https://console.partnerize.com (Username: `louisleex`)
- **Travelpayouts:** https://app.travelpayouts.com
- **Payoneer:** https://myaccount.payoneer.com

### Search Console + Analytics (to be set up)
- **Google Search Console:** https://search.google.com/search-console
- **Google Analytics:** https://analytics.google.com

---

## 14. Final notes for continuing on laptop

**To pick up this session on your laptop:**

1. Clone the repo:
   ```bash
   git clone https://github.com/louisleex05-byte/travel-site.git
   cd travel-site
   npm install
   ```

2. Copy env vars from Vercel dashboard → paste into `.env.local`:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with values from Vercel Settings → Environment Variables
   ```

3. Run locally:
   ```bash
   npm run dev
   # → http://localhost:3000
   ```

4. Any changes → same push flow:
   ```bash
   git add -A
   git commit -m "your change"
   git push
   ```

5. Vercel auto-deploys in ~30 seconds.

**What to work on next (in priority order):**
1. Fix CJ Superuser login (login as hotmail account) — biggest immediate revenue unlock
2. Wait for Agoda Affiliate Partnerships reply (3–5 days) — biggest strategic win
3. Apply to 6 more Travelpayouts programs (GetYourGuide, Trip.com, AirHelp, Airalo, DiscoverCars, Hostelworld)
4. Set up Google Analytics + Search Console for SEO tracking
5. Set up hello@driftcoconut.com via Cloudflare Email Routing
6. Write your first destination guide (Bali or Bangkok)
7. Add more hero photos (Tokyo, Chiang Mai, Sapa) from Pixabay

**Currently earning-capable:** 5 Travelpayouts programs (Klook, Welcome Pickups, Yesim, Kiwi, Drimsim). If someone visits driftcoconut.com right now and books any of those services via your TravelEssentials cards, you earn commission immediately.

🥥 Good luck on the laptop. Session context is fully preserved here.
