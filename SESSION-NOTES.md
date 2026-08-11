# driftcoconut — Full Session Notes

**Session date:** August 3, 2026
**Owner:** Niphon Srisawat (Louis Leex)
**Live site:** https://driftcoconut.com
**GitHub repo:** https://github.com/louisleex05-byte/travel-site
**Vercel project:** driftcoconut

---

## 1. Project overview

A Next.js 15 travel site that discovers and compares hotels across Asia-Pacific destinations, monetized through affiliate partnerships with major booking networks. Built end-to-end in one working session — from research to live deployment with custom domain, HTTPS, and multi-affiliate applications in progress.

**Positioning:** independent hotel discovery for English-speaking leisure travelers (25–55) planning tropical getaways, city breaks, and cultural trips across Asia-Pacific.

**Tech stack:**
- Next.js 15 (App Router, React 19, Server Components)
- TypeScript, Tailwind CSS with custom `sea` palette + Fraunces display serif
- Vercel hosting (Hobby plan)
- Cloudflare DNS (free plan)
- Z.com domain registrar

---

## 2. Affiliate program research (Round 1)

Compared major travel affiliate programs:

| Program | Commission | API | Cookie | Best for |
|---|---|---|---|---|
| **Agoda** | 4–7% tiered | Long Tail Search API (REST) | 1 day | Asia-Pacific hotels |
| **Booking.com** | ~4% (up to 40% of theirs) | Demand API (approval-gated) | Session | Global inventory |
| **Expedia (via Rapid API)** | 15–25% Expedia Collect | EPS Rapid API | 30 days | Bundling hotels+flights+cars |
| **Tripadvisor** | 50% of gross | No affiliate API | 14 days | Reviews-focused sites |
| **Skyscanner** | Up to 20% (or 50% of their commission) | Flights API | Varies | Flight comparison |
| **KAYAK** | Up to 50% | API + White Label | Varies | Meta-search |

Key takeaway: Tripadvisor moved OFF CJ Affiliate — now only Viator (their subsidiary) is available on affiliate networks. Booking.com traditional program was reduced in 2024, now runs through Awin or the direct Partner Hub.

---

## 3. Site development timeline

### Phase 1 — Scaffold
- Created Next.js 15 project with TypeScript + Tailwind
- Built lib/agoda.ts API client with mock mode (`AGODA_MOCK=true`)
- Added mock hotels dataset (9 realistic Bali/Bangkok hotels)
- Created search form, hotel card, hotel detail pages
- Added About, Privacy, Terms pages (required for affiliate approval)
- Expanded city list to 47 destinations grouped by region

### Phase 2 — Rebrand from TravelSite → driftcoconut
- New palette: seawater blue (custom `sea` ramp 50–900)
- New wordmark: Fraunces display serif in `sea-700`
- Coconut palm logo (SVG) — palm fronds + shell + water ripples
- Softer background: linear gradient from `#F0F9FB` to `#F8FAFC`
- Fonts scaled +20% via `html { font-size: 120% }`

### Phase 3 — Hero + rotation
- 6 rotating panoramic hero photos (Bali sunset, Maldives overwater, infinity pool, hammock, dhoni boat, palm beach)
- 3:1 aspect ratio on desktop → gracefully falls back to 21:9, 16:9, 4:3 on smaller viewports
- Off-center crop positions via `object-position` to prevent subject/text clash
- 7-second fade cross-transition
- Clickable dot indicators
- Photo credits (Pixabay attribution)

### Phase 4 — PartnerStrip trust bar
- Text-styled logotypes in brand colors: agoda, Booking.com, Expedia, Hotels.com, Viator (by Tripadvisor Group)
- Trust indicators: Best price guarantee · Free cancellation · Secure checkout · No booking fees
- "Powered by Tripadvisor Group" attribution line

### Phase 5 — Tropical decorations
- 10+ reusable SVG components: PalmLeaf, Shell, Pebble, Wave, Hibiscus, Starfish, Boat, StrawHat, Coral, Conch
- Dispersed across all pages at 40–60% opacity
- Fixed viewport-corner accents that drift as you scroll
- Hidden on mobile to reduce clutter (`hidden md:block`)

### Phase 6 — Mobile responsive fixes
- Header wordmark shrunk to `text-xl` on mobile
- Nav gap reduced (12 px mobile vs 24 px desktop)
- "Search" nav hidden on mobile, magnify glass icon shown instead
- Logo scaled: 48/56/64 px across breakpoints
- Header search field with magnify glass, smart routing to cities

### Phase 7 — Layout restructure
- Hero + PartnerStrip visually attached (no gap between)
- Search form moved to its own section with "Where to?" · "Search hotels" heading, id="search-form" for anchor scrolling
- Deals section (`#deals`) tightened up to sit closer to search
- Cards use emoji icons (🏝️ 🏙️ ⛰️) with subtle SVG accents in corners

---

## 4. Deployment & DNS journey

### Vercel deployment
- Repo pushed to GitHub via `gh` CLI
- Vercel auto-deploy on every `git push` to `main`
- Free subdomain: `driftcoconut.vercel.app` (always works as fallback)
- Custom domain: `driftcoconut.com`

### Custom domain setup — the sequence
1. Registered `driftcoconut.com` at **Z.com** registrar
2. In Cloudflare: added domain → got 2 nameservers: `alan.ns.cloudflare.com` + `dina.ns.cloudflare.com`
3. At Z.com: switched from Default nameservers to Custom → pasted Cloudflare's 2 nameservers
   - Blocker: Z.com requires 2FA to be enabled first — set up Two-Step Verification
   - Blocker: initially entered same nameserver twice — corrected to two different ones
4. In Cloudflare: added DNS records
   - A record: `@` → `216.198.79.1` (DNS only, grey cloud)
   - CNAME: `www` → `9e6a1127d9d5036b.vercel-dns-017.com` (DNS only, grey cloud)
5. In Vercel: added both `driftcoconut.com` and `www.driftcoconut.com` to project
6. Waited ~2 hours for full propagation
7. All 3 domains flipped to "Valid Configuration" green:
   - ✅ driftcoconut.com
   - ✅ www.driftcoconut.com (308 redirect to canonical)
   - ✅ driftcoconut.vercel.app (fallback)

### Critical lesson
- Do NOT use Cloudflare Proxy (orange cloud) for Vercel — breaks HTTPS provisioning. Always keep DNS-only (grey cloud).

---

## 5. Affiliate applications status

### Agoda (direct)
- **Site ID:** 1970237
- **Sites listed:** driftcoconut.com + old placeholder (`niphon.srisawat.approvalsite819358665.co`)
- **Status:** Pending Approval
- **Blocker:** Can't add new site through UI — form hangs. Emailed `partnersupport@agoda.com` requesting placeholder removal + new site addition.
- **Verification method:** Manual Verification (clicked Proceed)
- **Bank info:** Filled with Krungsri Bank details

### CJ Affiliate (Commission Junction)
- **Username:** LouisLeeX (with capitals)
- **Two users on account:**
  - Louis Leex — `louisleex@hotmail.com` — **Superuser** (Techguy)
  - Louis Lee — `louisleex05@gmail.com` — **Operator** (CEO) ← currently logged in
- **Onboarding checklist:** 7/8 completed
  - ✅ Validate Email
  - ✅ Enter user information
  - ✅ Complete Network Profile (description written, 798 chars)
  - ✅ Enter company details
  - ✅ Submit tax forms — W-8BEN submitted 3-Aug-2026 for Thailand
  - ✅ Add Promotional Property — Website type, `https://driftcoconut.com`
  - ⚠️ **Payment Information — LOCKED** (requires Superuser login to edit)
- **Blockers:**
  1. Wrong role — need to log in as Superuser (hotmail account) not Operator (gmail account)
  2. Payoneer account still pending verification (needed for US routing/account numbers)
- **Applied programs (all "Pending" — will process once account activated):**
  - Booking.com Italy
  - Booking.com LATAM
  - Booking.com MEA
  - Booking.com Nordics
  - Booking.com North America (needs onboarding complete before it processes)
  - Booking.com Spain & Portugal
  - Booking.com UK

### Awin
- **Publisher ID:** 3018153
- **Primary region:** USA (Thailand not available as primary)
- **Applied programs (all Pending):**
  - Viator - A Tripadvisor Company (US)
  - Lebua Hotels (Global) — Thai brand, great fit
  - Chatrium Hotels (Global) — Thai/Asia brand
- **Deposit:** $5 refundable (returned as first commission earned)
- **W-8BEN:** Submitted

### Partnerize (for Expedia / Hotels.com / Vrbo)
- **Username:** `louisleex` (all lowercase!)
- **Status:** Cannot log in — likely case mismatch on username or password issue
- **Next:** Log in via "Forgotten login details" flow to reset password

### Payoneer
- **Status:** USD receiving account pending KYC verification
- **Timeline:** Up to 3 business days for approval
- **Blockers:** Waiting on Payoneer's identity/address/document review
- **Once approved:** Get US routing (ABA) + account number + bank name → paste into CJ Payment Information → CJ activates

---

## 6. Key architecture decisions

### Server-side API proxy
- Agoda API key never touches the browser
- `app/search/page.tsx` is a Server Component — calls `searchAgoda()` directly on the server
- Response cached 15 min via `next: { revalidate: 900 }`
- Mock mode fallback: `AGODA_MOCK=true` serves realistic sample hotels before Agoda API approval

### Environment variables (all set in Vercel)
- `NEXT_PUBLIC_SITE_URL=https://driftcoconut.com`
- `AGODA_MOCK=true` (flip to false once Agoda approves)
- `AGODA_SITE_ID=` (fill when approved)
- `AGODA_API_KEY=` (fill when approved)
- Placeholders for `BOOKING_AFFILIATE_ID`, `EXPEDIA_API_KEY`, `TRIPADVISOR_CJ_ID`

### Design system
- **Palette:** custom `sea` ramp (10 stops from `#F0F9FB` to `#0F3541`)
- **Typography:** Fraunces (display) + system sans (body)
- **Radius:** 12px cards, 24px hero bottom corners
- **Shadow:** minimal, functional only
- **Focus rings:** sea-blue (accessibility)

---

## 7. File structure

```
Travel Site/
├── app/
│   ├── layout.tsx              # Header, footer, metadata, HeaderSearch
│   ├── page.tsx                # Home: Hero + PartnerStrip + Search + Deals
│   ├── globals.css             # Font imports, root font-size scaling
│   ├── icon.svg                # Favicon
│   ├── apple-icon.svg          # iOS home screen icon
│   ├── about/page.tsx          # About us
│   ├── privacy/page.tsx        # Privacy policy
│   ├── terms/page.tsx          # Terms of use
│   ├── search/page.tsx         # Search results (server component)
│   ├── hotel/[id]/page.tsx     # Hotel detail page
│   └── api/agoda/search/route.ts   # JSON proxy for Agoda API
├── components/
│   ├── Hero.tsx                # Rotating panoramic hero
│   ├── SearchForm.tsx          # Destination + dates + guests
│   ├── HeaderSearch.tsx        # Compact search bar in header
│   ├── HotelCard.tsx           # Grid tile with photo + affiliate link
│   ├── PartnerStrip.tsx        # Trust bar with partner brands
│   ├── Logo.tsx                # Coconut palm SVG
│   └── Decorations.tsx         # 10+ tropical accent SVGs
├── lib/
│   ├── agoda.ts                # Typed API client (with mock mode)
│   ├── cities.ts               # 47 curated destinations by region
│   ├── heroPhotos.ts           # Rotating hero config
│   └── mockHotels.ts           # Sample hotels + detail data
├── public/
│   └── hero/                   # 6 panoramic photos
│       ├── bali-sanur.jpg
│       ├── maldives-overwater.jpg
│       ├── maldives-pool.jpg
│       ├── maldives-hammock.jpg
│       ├── maldives-dhoni.jpg
│       └── maldives-palm-beach.jpg
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

## 8. Commands reference

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

### Manual deploy
```bash
vercel --prod
```

---

## 9. Current blockers & next actions

### 🚨 Priority 1 — Fix CJ Superuser login
- Log out of CJ (Operator: `louisleex05@gmail.com`)
- Log back in with **`louisleex@hotmail.com`** (Superuser)
- If password forgotten → "Forgot Password" → check hotmail inbox → reset
- Once in as Superuser, complete Payment Information (once Payoneer approves)

### 🚨 Priority 2 — Wait on Payoneer (1–3 business days)
- Check Gmail daily for Payoneer verification requests
- Submit any missing docs immediately (ID, address, selfie)
- When approved: log in → Receive → USD receiving account → copy routing + account numbers

### Priority 3 — Follow up with Agoda
- Send update email to `partnersupport@agoda.com`
- Subject: "Status update request — Site ID 1970237"
- Confirm driftcoconut.com is fully live, ask for prioritized review

### Priority 4 — Fix Partnerize login
- Try username: `louisleex` (all lowercase)
- If fails: use "Forgotten login details" to reset

### Priority 5 — Apply to more affiliates
On Awin (once approved): Klook, Etihad, Emirates, Qatar Airways, Marriott, Hilton, IHG, Accor, GetYourGuide, Skyscanner, Trip.com

On CJ (once activated): Trip.com, Marriott, Klook, Hilton, Rentalcars.com

### Priority 6 — Build content
Write 3–5 destination guides on driftcoconut. Real content = faster affiliate approvals and better SEO.

---

## 10. What to do when each affiliate approves

### Agoda approved:
1. Get Site ID (CID) + API Key from Agoda dashboard → Tools → API
2. In Vercel Environment Variables:
   - `AGODA_MOCK=false`
   - `AGODA_SITE_ID=<your CID>`
   - `AGODA_API_KEY=<your key>`
3. Redeploy (`vercel --prod` or push any commit)
4. Site now serves live hotel data with your affiliate tracking

### CJ / Tripadvisor / Viator approved:
1. Download official brand logos from partner dashboard
2. Update `components/PartnerStrip.tsx` — swap text logotype for official image
3. Update `app/hotel/[id]/page.tsx` — add "See on Tripadvisor" outbound link with tracking

### Booking.com approved:
1. Use their Deep Link Builder to generate tracked URLs
2. Add as a second CTA on hotel detail pages
3. Or offer as "Book on Booking.com" alternative to Agoda

### Expedia (via Partnerize) approved:
1. Download brand assets for Expedia + Hotels.com + Vrbo (one signup covers all 3)
2. Add "Book on Hotels.com" tracked link on detail page
3. Use Rapid API in future to serve Expedia inventory directly

---

## 11. Key learnings

- **Domain propagation takes hours.** Even with correct nameservers, DNS updates worldwide slowly. Be patient.
- **Cloudflare Proxy breaks Vercel HTTPS.** Always use DNS-only (grey cloud) for Vercel origins.
- **Affiliate approvals take 1–4 weeks** for premium travel brands. 24-hour approvals are rare and only for smaller brands.
- **CJ has role hierarchy.** Operator ≠ Superuser. Payment info edits require Superuser role.
- **Payoneer is the payment infrastructure for Thai publishers.** Native Thai bank details don't validate on US networks. Payoneer's US-format routing/account works everywhere.
- **Text logos are safer than official images** until each affiliate approves you. Then swap for their official co-branded assets.
- **Photo licenses matter.** Pixabay + Unsplash are safe for free commercial use. Agoda API photos can only be used alongside Agoda booking widgets.

---

## 12. Reference URLs

- **Live site:** https://driftcoconut.com
- **Vercel dashboard:** https://vercel.com/sometum-deedee-s-projects/driftcoconut
- **GitHub repo:** https://github.com/louisleex05-byte/travel-site
- **Cloudflare dashboard:** https://dash.cloudflare.com → driftcoconut.com
- **Agoda Partners:** https://partners.agoda.com
- **CJ Affiliate:** https://members.cj.com
- **Awin:** https://ui.awin.com
- **Partnerize:** https://console.partnerize.com
- **Payoneer:** https://myaccount.payoneer.com

---

## 13. Contact for support (when things break)

- **Agoda:** `partnersupport@agoda.com`
- **CJ Affiliate:** `publishersupport@cj.com`
- **Awin:** support ticket via Awin dashboard
- **Partnerize:** `support@partnerize.com`
- **Payoneer:** in-app chat or `support@payoneer.com`
- **Vercel:** community forum + docs
- **Cloudflare:** community forum + docs

---

## 14. Final notes

You built a professional, brand-consistent travel platform in one working session:
- Live on custom `.com` domain with HTTPS
- Mobile-responsive with 6-photo rotating hero
- Tropical Hawaiian/Maldivian brand identity
- Legal pages required for affiliate approval
- Multiple affiliate applications in-flight
- Payment infrastructure set up (Payoneer)
- Complete tax paperwork submitted (W-8BEN for Thailand)

Real work now shifts from technical setup to **content, marketing, and traffic**. The foundation is solid. When affiliate approvals arrive over the next 1–4 weeks, everything will just plug in.

🥥 Good luck.
