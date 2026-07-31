# Connect driftcoconut.com — Cloudflare DNS + Vercel hosting

Total time: ~15 minutes. Domain cost: whatever you paid for `driftcoconut.com` (~$10/yr). Cloudflare DNS + Vercel Hobby are free.

## The setup you'll end up with

```
Visitor → Cloudflare (DNS + optional CDN) → Vercel (Next.js hosting) → driftcoconut
```

Vercel handles the app runtime; Cloudflare manages your DNS and can add another CDN/security layer.

---

## Prerequisites (one-time)

Install these if you don't have them:

```bash
# GitHub CLI (for pushing code)
# Windows: winget install --id GitHub.cli
# Mac:     brew install gh

# Vercel CLI (for deploying)
npm install -g vercel
```

Sign in:

```bash
gh auth login
vercel login
```

The repo is already on GitHub at `github.com/louisleex05-byte/travel-site` and deploys to Vercel on every push.

---

## Step 1 — Add driftcoconut.com to Cloudflare

1. Sign up / log in at **https://dash.cloudflare.com**
2. Click **"+ Add a domain"** → type `driftcoconut.com` → **Continue**
3. Choose the **Free plan** → **Continue**
4. Cloudflare shows you 2 nameservers, e.g.:
   ```
   xxx.ns.cloudflare.com
   yyy.ns.cloudflare.com
   ```
   **Copy both.**

## Step 2 — Point your registrar to Cloudflare

Go to the registrar you bought the domain from → Nameservers section → change from default to **Custom** → paste both Cloudflare nameservers.

Wait 5–30 min. Cloudflare will email when active.

*(If you bought via Cloudflare Registrar, skip this — DNS is already there.)*

## Step 3 — Add the domain to Vercel

1. **https://vercel.com/dashboard** → **travel-site** → **Settings → Domains**
2. Type `driftcoconut.com` → **Add**
3. Also add `www.driftcoconut.com`
4. Vercel gives you 2 DNS records — an **A** for root and a **CNAME** for `www`:
   ```
   Type: A       Name: @      Value: 76.76.21.21
   Type: CNAME   Name: www    Value: cname.vercel-dns.com
   ```
   **Keep this tab open.**

## Step 4 — Add DNS records in Cloudflare

1. Cloudflare → click `driftcoconut.com` → **DNS → Records**
2. Add the A record:
   - Type: `A`
   - Name: `@`
   - IPv4: `76.76.21.21`
   - Proxy status: **DNS only** (grey cloud) — Vercel handles HTTPS
   - **Save**
3. Add the CNAME:
   - Type: `CNAME`
   - Name: `www`
   - Target: `cname.vercel-dns.com`
   - Proxy status: **DNS only**
   - **Save**

## Step 5 — Verify + go live

Back in Vercel → Settings → Domains — both entries should show **"Valid Configuration"** with a green check within 2–5 min. HTTPS certificate provisions automatically.

Visit **https://driftcoconut.com** — you're live. 🥥

---

## Environment variables

In Vercel dashboard → Settings → Environment Variables, make sure these are set for **Production + Preview + Development**:

| Name | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://driftcoconut.com` | Used for canonical URLs |
| `AGODA_MOCK` | `true` | Serves sample hotels while Agoda API pending |
| `AGODA_SITE_ID` | *(leave blank until approved)* | Fill once Agoda approves you |
| `AGODA_API_KEY` | *(leave blank until approved)* | Fill once Agoda approves you |

After changing any env var, redeploy:

```bash
vercel --prod
```

Or just push a commit — auto-deploy picks up new env vars.

---

## Submit driftcoconut.com to Agoda for verification

1. Log into `partners.agoda.com` → **Profile → Manage Your Sites**
2. Add `https://driftcoconut.com` and click **Verify Domain**
3. Agoda gives you ONE of:
   - **Meta tag** — copy the `content` value, add to Vercel env vars as `NEXT_PUBLIC_AGODA_VERIFICATION`, redeploy
   - **File upload** — save the file to `public/agoda-verification.html`, commit, push
4. Click **Verify** in the Agoda dashboard

The `layout.tsx` auto-injects the meta tag when the env var is present — no code changes needed.

---

## Once Agoda approves your account

1. Agoda dashboard → **Tools → API** → generate API key
2. Vercel env vars:
   - `AGODA_MOCK` → `false`
   - `AGODA_SITE_ID` → your CID
   - `AGODA_API_KEY` → your key
3. `vercel --prod` — the site now serves real live hotel data with your affiliate tracking

## Also submit driftcoconut.com to:

- **Booking.com** (via Partnerships Hub or Awin)
- **Expedia** (via Partnerize signup)
- **Tripadvisor** (via CJ Affiliate)

Same domain, same verification pattern — one URL to rule them all.

---

## Optional: Cloudflare speed boosters

Once the domain works via DNS-only, you can flip the proxy status to **Proxied** (orange cloud) for extra CDN + DDoS protection:

- **SSL/TLS → Overview** → set to **Full (strict)**
- **Rules → Page Rules** → force HTTPS redirect
- **Speed → Optimization** → enable Auto Minify (JS, CSS, HTML)
- **Email → Email Routing** → forward `hello@driftcoconut.com` to your Gmail (free)

## Future updates

Any `git push` to `main` auto-deploys:

```bash
git add -A
git commit -m "your change"
git push
# → live at driftcoconut.com in ~30 seconds
```
