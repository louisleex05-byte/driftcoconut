# Booking.com Affiliate Setup — driftcoconut.com

**Session notes · Aug 28, 2026**

## Program status

- **Program:** Booking.com North America (advertiser ID `7864295`) via CJ Affiliate (Commission Junction)
- **Approved:** 14-May-2026 (per CJ join date on the advertiser detail screen)
- **Publisher ID:** `101849416`
- **Commission:** Lead 4% on completed stays. Flights start at $2, Attractions 4%, Cars 3.8%
- **Cookie policy:** No cookie tracking — **in-session only**. Click → book must happen in a single browsing session
- **Currencies:** CAD, USD
- **7-day EPC on the program:** $173.34

## ⚠️ Regional mismatch — action required

The North America program is optimized for US/CA traffic (77% US, 6.5% CA conversion split). driftcoconut.com's specialty is Asia, so this program alone will underperform.

**To do:** Search CJ **Advertisers → Booking.com** and apply to the sibling programs:

- Booking.com EMEA / Global (multilingual creative)
- Booking.com APAC (if surfaced for your publisher country)
- Booking.com Flights / Cars / Attractions (sometimes broken out as separate advertiser IDs)

Approval is usually instant once you're already in the NA program.

## Top 3 links (of 93 available)

| # | Link | ID | 7-Day EPC | Use |
|---|---|---|---|---|
| 1 | **Evergreen** (deep link) | `17293132` | $114.27 | Workhorse — wrap any Booking URL. Use for 90% of in-content links |
| 2 | **Getaway deals 2026** | `17288985` | $197.84 | Highest EPC. Seasonal — runs 11-May → 1-Oct-2026 |
| 3 | **Attractions homepage** | `17288984` | $70.15 | Good Asia inventory, skips hotel in-session friction |

**Skip:** Flights and Cars banners (Flights near-zero EPC, Cars is US/CA fleet-heavy).

## Evergreen link decoded

```html
<a href="https://www.tkqlhce.com/click-101849416-17293132" target="_top"></a>
<img src="https://www.lduhtrp.net/image-101849416-17293132" width="1" height="1" border="0"/>
```

- `tkqlhce.com/click-...` → CJ click redirector (rotates with `anrdoezrs.net`, `jdoqocy.com`, `dpbolvw.net` — all CJ-owned)
- `lduhtrp.net/image-...` → 1×1 impression pixel. **Never strip this** — CJ uses it to reconcile EPC
- As-pasted the anchor is empty (unclickable) — you fill it with text or an image

## Paste-ready snippets

### Inline text link

```html
Ready to book? <a href="https://www.tkqlhce.com/click-101849416-17293132?url=https%3A%2F%2Fwww.booking.com%2Fsearchresults.html%3Fss%3DBali"
   target="_blank" rel="sponsored nofollow noopener">Search hotels in Bali on Booking.com</a>
```

### Featured card (post end / sidebar)

```html
<aside class="booking-card" style="border:1px solid #e5e5e5;border-radius:12px;padding:20px;margin:24px 0;max-width:640px;font-family:system-ui,sans-serif">
  <div style="font-size:.75em;text-transform:uppercase;letter-spacing:.08em;color:#888;margin-bottom:8px">Affiliate partner</div>
  <h3 style="margin:0 0 8px;font-size:1.15em">Find your stay in Southeast Asia</h3>
  <p style="margin:0 0 16px;color:#555;line-height:1.5">2.3M properties · free cancellation on most stays · price match guarantee.</p>
  <a href="https://www.tkqlhce.com/click-101849416-17293132?url=https%3A%2F%2Fwww.booking.com%2Fsearchresults.html%3Fss%3DBali"
     target="_blank" rel="sponsored nofollow noopener"
     style="display:inline-block;background:#003580;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600">
    Search hotels →
  </a>
</aside>
```

`#003580` is Booking's brand navy.

### Impression pixel (once per page, in footer)

```html
<img src="https://www.lduhtrp.net/image-101849416-17293132" width="1" height="1" border="0"
     alt="" loading="lazy" style="position:absolute;left:-9999px" aria-hidden="true">
```

## Deep-link recipe

Template:

```
https://www.tkqlhce.com/click-101849416-17293132?url=<URL_ENCODED_BOOKING_URL>
```

Ready-to-encode Asia destinations:

| Destination | Booking URL |
|---|---|
| Bali | `https://www.booking.com/searchresults.html?ss=Bali` |
| Chiang Mai | `https://www.booking.com/searchresults.html?ss=Chiang+Mai` |
| Bangkok | `https://www.booking.com/searchresults.html?ss=Bangkok` |
| Ho Chi Minh City | `https://www.booking.com/searchresults.html?ss=Ho+Chi+Minh+City` |
| Kyoto | `https://www.booking.com/searchresults.html?ss=Kyoto` |
| Boracay | `https://www.booking.com/searchresults.html?ss=Boracay` |

Booking auto-detects the user's browser locale — a Thai reader clicking a `?ss=Chiang+Mai` link lands on the Thai UI with THB pricing. Affiliate ID rides through the session.

### JS helper

```js
const cjLink = (bookingUrl) =>
  `https://www.tkqlhce.com/click-101849416-17293132?url=${encodeURIComponent(bookingUrl)}`;

// usage:
<a href={cjLink('https://www.booking.com/searchresults.html?ss=Chiang+Mai')}
   rel="sponsored nofollow noopener" target="_blank">
  Chiang Mai hotels
</a>
```

## FTC disclosure — required

**Footer, site-wide:**

```html
<p style="font-size:.8em;color:#888;text-align:center;padding:16px">
  driftcoconut.com participates in affiliate programs including Booking.com.
  We may earn a commission when you book through our links, at no cost to you.
</p>
```

**Inline near each affiliate block:**

```html
<p style="font-size:.85em;color:#888"><em>* Affiliate link — driftcoconut may earn a small commission at no cost to you.</em></p>
```

At least one is legally required. FTC has fined bloggers for missing this.

## Placement strategy

**Do:**

- Contextual text link in the flow of destination posts ("we stayed at [this hotel]")
- Booking search widget inline in destination guides
- Sticky sidebar rectangle on travel-content pages only
- End-of-post CTA card

**Skip:**

- Header banners (low intent)
- Popup interstitials (Booking treats as low-quality traffic and can pause commissions)
- Homepage-only placement (viewer isn't in booking-intent mode)

## Open items

- [ ] Confirm driftcoconut.com tech stack (WordPress / Next.js / Astro / other) — determines shortcode vs component vs raw HTML pattern
- [ ] Grab Getaway deals 2026 banner HTML (300×250 or 728×90) for seasonal placement, calendar-reminder to swap on 1-Oct-2026
- [ ] Apply to Booking.com EMEA / APAC CJ programs for Thai/Japanese/Chinese creative
- [ ] Set a first live test link → click → check CJ Reports → Real-Time in 30 min to confirm attribution
- [ ] Add FTC disclosure to site footer before going live

## Reference URLs

- CJ publisher dashboard: [members.cj.com](https://members.cj.com/)
- Booking.com Resource Hub: linked from CJ approval email
- CJ Booking.com program contact: `booking_us@cj.com`
