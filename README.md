# driftcoconut — Next.js + Agoda affiliate travel site

A minimal but complete Next.js 15 (App Router) travel site that searches hotels through the Agoda Long Tail Affiliate API and monetizes clicks via affiliate deep links. Branded as **driftcoconut** — a coastal hotel discovery platform.

**Live site:** https://driftcoconut.com

**→ To deploy live, see [DEPLOY.md](./DEPLOY.md)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flouisleex05-byte%2Ftravel-site&env=AGODA_MOCK,AGODA_SITE_ID,AGODA_API_KEY,NEXT_PUBLIC_SITE_URL&envDescription=Set%20AGODA_MOCK%3Dtrue%20to%20use%20sample%20data%20before%20API%20approval)

## Stack

- Next.js 15 (App Router, React 19, Server Components)
- TypeScript
- Tailwind CSS with a custom `sea` palette + Fraunces display serif
- Server-side API proxy (keeps affiliate API keys out of the browser)
- Vercel hosting + Cloudflare DNS/CDN

## Project structure

```
app/
  layout.tsx              # site shell (header with logo/wordmark, footer)
  page.tsx                # homepage: hero slideshow + partner strip + deals
  search/page.tsx         # server-rendered results grid
  hotel/[id]/page.tsx     # hotel detail page with photo gallery + book CTA
  about|privacy|terms/    # required legal pages
  api/agoda/search/       # JSON proxy (optional — pages fetch directly on server)
  icon.svg + apple-icon.svg  # brand favicon (coconut palm)
components/
  Hero.tsx                # rotating panoramic hero with 6 destination photos
  SearchForm.tsx          # client component — city/date/guests
  HotelCard.tsx           # hotel tile with photo + affiliate link
  PartnerStrip.tsx        # trust strip: Agoda, Booking, Expedia, Hotels, Tripadvisor
  Logo.tsx                # inline SVG brand logo
  Decorations.tsx         # tropical accent icons: palm, shell, boat, hat, coral, etc.
lib/
  agoda.ts                # typed Agoda Long Tail API client (with mock mode)
  cities.ts               # 47 curated destination cityIds (grouped by region)
  heroPhotos.ts           # rotating hero slideshow config
  mockHotels.ts           # sample hotel data used before Agoda API approval
public/
  hero/                   # panoramic hero photos (Bali, Maldives, etc.)
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Get Agoda credentials

1. Sign up at https://partners.agoda.com
2. Fill out the personal + business profile (individual/sole proprietor is fine)
3. Wait 2–5 business days for account approval
4. Once approved: **Tools → API** → generate your **API Key** and note your **Site ID (CID)**

### 3. Create `.env.local`

```bash
cp .env.example .env.local
```

While waiting for approval, leave `AGODA_MOCK=true` — the site will serve realistic sample hotels so you can develop and deploy immediately.

Once approved, fill in:

```
AGODA_MOCK=false
AGODA_SITE_ID=1234567
AGODA_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 4. Run

```bash
npm run dev
```

Open http://localhost:3000

## How it works

1. User picks a city, dates, guests → `SearchForm` pushes to `/search?cityId=...`
2. `app/search/page.tsx` is a **Server Component** — calls `searchAgoda()` directly on the server, so the API key never touches the browser
3. Response is cached for 15 minutes (`revalidate: 900`) to avoid burning API quota on repeated searches
4. Each `HotelCard` links to `/hotel/[id]` (in-app detail page), and the "Book Now" CTA on the detail page uses `hotel.landingURL` — Agoda's affiliate URL with your `siteid` embedded for commission attribution
5. Photos hotlink from `pix*.agoda.net` — Next.js `<Image>` handles responsive sizing + lazy loading

## Adding affiliate partners beyond Agoda

- **Booking.com**: sign up at https://partnerships.booking.com/ (or via Awin as backup)
- **Expedia / Hotels.com / Vrbo**: sign up via Partnerize at https://signup.partnerize.com/signup/en/expedia
- **Tripadvisor**: sign up via CJ Affiliate at https://signup.cj.com/member/publisherSignUp.do, then apply to their program
- **Skyscanner (flights)**: apply at https://partners.skyscanner.net
- **Travelpayouts (meta-network)**: one signup for 90+ programs at https://travelpayouts.com

Once approved, drop each partner's official logo into `PartnerStrip.tsx` and their tracking URL builder into a new `lib/[partner].ts` file mirroring the Agoda client.

## Photo usage — legal notes

Hero photos in `public/hero/` are from Pixabay + Unsplash (free commercial-use licenses, no attribution required — credits shown as courtesy).

Agoda's affiliate ToS allow you to display their hotel photos **only alongside the booking widget for that hotel**. Do not:
- Save Agoda photos to your own storage
- Use them in unrelated editorial content
- Use them to promote a competing OTA

Always hotlink Agoda photos from the URLs their API returns (`pix*.agoda.net`).

## Deploy

The site is hosted on Vercel with automatic deployment on every `git push` to `main`:

```bash
git add -A
git commit -m "your change"
git push
# → live at driftcoconut.com in ~30 seconds
```

Domain `driftcoconut.com` is managed via Cloudflare DNS (free plan) pointing to Vercel via A record (root) + CNAME (www).

## License

MIT — do what you want.
