# Travel Site — Next.js + Agoda affiliate starter

A minimal Next.js 15 (App Router) scaffold that searches hotels through the Agoda Long Tail Affiliate API and monetizes clicks via affiliate deep links.

**→ To deploy live, see [DEPLOY.md](./DEPLOY.md)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Ftravel-site&env=AGODA_MOCK,AGODA_SITE_ID,AGODA_API_KEY&envDescription=Set%20AGODA_MOCK%3Dtrue%20to%20use%20sample%20data%20before%20API%20approval)

## Stack

- Next.js 15 (App Router, React 19, Server Components)
- TypeScript
- Tailwind CSS
- Server-side API proxy (keeps your Agoda apikey out of the browser)

## Project structure

```
app/
  layout.tsx          # site shell (header, footer)
  page.tsx            # home page + search form
  search/page.tsx     # server-rendered results grid
  api/agoda/search/route.ts  # JSON proxy (optional; page fetches directly)
components/
  SearchForm.tsx      # client component — city/date/guests
  HotelCard.tsx       # hotel tile with photo + affiliate CTA
lib/
  agoda.ts            # typed Agoda API client
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Get Agoda credentials

1. Sign up at https://partners.agoda.com
2. In the partner dashboard, create a site and note your **Site ID**
3. Go to API section and generate an **API Key**

### 3. Create `.env.local`

```bash
cp .env.example .env.local
```

Fill in:

```
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
2. `app/search/page.tsx` is a **Server Component** — it calls `searchAgoda()` directly on the server, so the API key never touches the browser
3. Response is cached for 15 minutes (`revalidate: 900`) to avoid burning API quota on repeated searches
4. Each `HotelCard` links to `hotel.landingURL` — Agoda's affiliate URL with your `siteid` embedded for commission attribution
5. Photos hotlink from `pix*.agoda.net` — Next.js `<Image>` handles responsive sizing + lazy loading

## Adding more cities

Edit `components/SearchForm.tsx` — the `CITIES` array. Agoda provides a full city ID reference file in their partner portal (thousands of destinations).

## Extending

- **Hotel detail page**: add `app/hotel/[id]/page.tsx` — call Agoda with `hotelIds: [id]` to get the full record with room types and photo array
- **Filters**: add price / star / amenity filters as URL params, re-render server-side
- **Expedia Rapid API**: apply at partner.expediagroup.com, add `lib/expedia.ts` mirroring the Agoda client
- **Booking.com**: use their Deep Link Builder for no-approval widgets; apply for Demand API once you have booking volume
- **Redis cache**: swap the `next: { revalidate }` for Upstash Redis to cache across serverless invocations
- **Analytics**: add PostHog + track outbound clicks on `HotelCard` for conversion optimization

## Photo usage — legal notes

Agoda's affiliate ToS allow you to display their hotel photos **only alongside the booking widget for that hotel**. You cannot:

- Save photos to your own storage
- Use them in unrelated editorial content
- Use them to promote a competing OTA

Always hotlink from the URLs Agoda returns (`pix*.agoda.net`).

## Deploy

```bash
# Vercel (recommended)
vercel

# Set env vars in the Vercel dashboard:
# AGODA_SITE_ID, AGODA_API_KEY
```

## License

MIT — do what you want.
