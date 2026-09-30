# driftcoconut GA Dashboard — Architecture & Reinstall Guide

A self-contained local dashboard that pulls Google Analytics data and generates AI-written insights. No servers to deploy, no accounts to create for other users — everything runs on your machine.

---

## 1. What it does

- Pulls last 28 days of Google Analytics data for `driftcoconut.com`
- Renders KPIs (page views, sessions, bounce rate, Chinese-content share)
- Estimates self-generated traffic vs real earned traffic
- Lists top pages + traffic sources
- **Generates 2-paragraph AI insight** using Gemini 3.5 Flash-Lite (cached by data fingerprint — only calls the API when data actually changes)
- Serves the dashboard from a local Node HTTP server (`http://localhost:5788`) so the "Update Data" and "Rewrite" buttons work directly from the browser

---

## 2. Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│  refresh-dashboard.bat  (Windows launcher, double-click to start) │
└──────────────────────────────┬────────────────────────────────────┘
                               │ launches
                               ▼
┌───────────────────────────────────────────────────────────────────┐
│  Node.js:  scripts/dashboard-server.mjs                           │
│                                                                    │
│  1. OAuth 2.0 auth flow (first run only, cached for ~6 months)    │
│  2. Fetches GA data via GA Data API                                │
│  3. Generates AI insight (Gemini 3.5 Flash-Lite, cached by hash)   │
│  4. Serves ga-dashboard.html at http://localhost:5788              │
│  5. POST /refresh endpoint for the Update Data button              │
└──────────────────────────────┬────────────────────────────────────┘
                               │
       ┌───────────────────────┼──────────────────────┐
       ▼                       ▼                      ▼
┌─────────────┐        ┌──────────────┐       ┌──────────────┐
│  Google     │        │   Gemini     │       │   Browser    │
│  Analytics  │        │   3.5 Flash  │       │   (Chrome)   │
│  Data API   │        │   Lite       │       │              │
│  (FREE)     │        │  (~$0.00008  │       │  Renders     │
│             │        │   per call)  │       │  dashboard   │
└─────────────┘        └──────────────┘       └──────────────┘
```

---

## 3. Tool stack

| Layer | Technology | Why |
|---|---|---|
| **Runtime** | Node.js 18+ | Built-in `fetch`, `http`, `fs`, `crypto` — zero npm dependencies |
| **Auth** | Google OAuth 2.0 (Desktop client) | Works around orgs that block service account keys via "Secure by Default" policy |
| **Data source** | Google Analytics Data API v1beta | Official REST API, free tier (25,000 requests/day) |
| **AI insights** | Gemini 3.5 Flash-Lite via `generativelanguage.googleapis.com` | Cheapest available Gemini model |
| **Cache layer** | SHA256 fingerprint on GA payload | Prevents wasteful Gemini calls when nothing changed |
| **Web UI** | Plain HTML/CSS/JS (no framework) | Loads instantly, single file, no build step |
| **Launcher** | Windows batch file | One-click startup for non-developer use |
| **Secret storage** | `.env.local` + gitignored JSON files | Never committed to git |

---

## 4. File structure

```
Travel Site/                          ← project root
├── install-dashboard.bat             ← ONE-TIME SETUP WIZARD (double-click first)
├── refresh-dashboard.bat             ← DAILY LAUNCHER (double-click every use)
├── dashboard.md                      ← this reinstall guide
├── scripts/
│   └── dashboard-server.mjs          ← ALL THE LOGIC (~400 lines Node ESM)
│
├── ga-oauth-client.json              ← OAuth Desktop client credentials (setup step)
├── ga-token.json                     ← auto-created after first sign-in
├── ga-insight-cache.json             ← auto-created AI insight cache
├── ga-dashboard.html                 ← auto-generated dashboard HTML (regenerated each fetch)
│
├── .env.local                        ← contains GEMINI_API_KEY (setup step)
└── .gitignore                        ← blocks all the above credential/cache files
```

**Files you create manually (once):**
- `ga-oauth-client.json` — downloaded from Google Cloud Console
- Add `GEMINI_API_KEY=...` line to `.env.local`

**Files auto-created by the script:**
- `ga-token.json` — after first browser sign-in
- `ga-insight-cache.json` — after first Gemini call
- `ga-dashboard.html` — every time you refresh

---

## 5. Prerequisites (any PC)

| Requirement | How to check | How to install |
|---|---|---|
| **Node.js 18+** | Open cmd → `node --version` (must show v18 or higher) | Download LTS from https://nodejs.org |
| **Google account with GA access** | Log into https://analytics.google.com and see `driftcoconut` property | — |
| **Google Cloud Console access** | https://console.cloud.google.com must open | Any Google account works |
| **Gemini API key** *(optional — dashboard works without it)* | Existing AI Studio key or new one from https://aistudio.google.com/apikey | Create for free at that URL |

---

## 6. Reinstall procedure (portable to any Windows PC)

### 6.1 Copy the source files

Copy these to the new PC (into any folder — the .bat auto-locates itself via `%~dp0`):

```
install-dashboard.bat              ← run this ONCE for setup
refresh-dashboard.bat              ← run this every time after
scripts/dashboard-server.mjs
.gitignore
dashboard.md                       ← this doc
```

### 6.1a EASY MODE — run the install wizard

Double-click `install-dashboard.bat`. It guides you through all six setup steps interactively:

1. Verifies Node.js is installed (offers download link if not)
2. Verifies project files are present
3. Auto-opens Google Cloud project creation page + waits for you to enable GA Data API
4. Auto-opens OAuth consent screen + Credentials pages, guides you to download the JSON
5. Waits for `ga-oauth-client.json` to appear in the folder (with error retry)
6. Auto-opens GA Admin to grant Viewer access; optionally captures your Gemini API key into `.env.local`

At the end, it auto-launches `refresh-dashboard.bat`. The very first launch pops the browser for a one-time Google sign-in.

### 6.1b MANUAL MODE — if you prefer step-by-step

Do **NOT** copy these — they're machine/account-specific:
- `ga-oauth-client.json`
- `ga-token.json`
- `ga-insight-cache.json`
- `ga-dashboard.html`
- `.env.local`

Steps 6.2–6.4 below cover the manual path (identical to what the wizard does).

### 6.2 One-time Google Cloud setup

**Step 1** — Create Cloud project
- https://console.cloud.google.com → New Project → name it `driftcoconut-ga`

**Step 2** — Enable APIs
- APIs & Services → Library → search & Enable: **Google Analytics Data API**

**Step 3** — Configure OAuth consent screen
- APIs & Services → OAuth consent screen (or "Google Auth Platform" in newer UI)
- User Type: **External**
- App name: `driftcoconut-dashboard`
- Support email + developer email: your email
- Skip Scopes
- Save → Add yourself as a **Test user**

**Step 4** — Create OAuth Desktop client
- APIs & Services → Credentials → **+ Create Credentials** → **OAuth client ID**
- Application type: **Desktop app**
- Name: `driftcoconut-desktop`
- Create → **DOWNLOAD JSON**
- Rename downloaded file to exactly `ga-oauth-client.json`
- Move it into the project folder next to `refresh-dashboard.bat`

**Step 5** — Grant GA property access
- https://analytics.google.com → Admin (gear icon)
- Property access management → **+ Add users**
- Enter your Google email → Role: **Viewer** → Add

### 6.3 (Optional) Enable AI insights

Add this line to `.env.local` in the project root:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

You can reuse any existing Gemini key from https://aistudio.google.com/apikey. The dashboard works without this line — the AI panel just shows a helper message instead.

### 6.4 First run

**Double-click `refresh-dashboard.bat`**

- Terminal opens, prints `🔐 First-run authorization needed. Opening browser...`
- Browser opens Google sign-in
- Sign in with the Google account that has GA access
- Warning: "Google hasn't verified this app" → click **Advanced** → **Go to driftcoconut-dashboard (unsafe)** *(safe because you built the app)*
- Grant permission
- Browser shows "✓ Authorized — close this tab"
- Terminal fetches data + generates AI insight
- **New browser tab opens with the dashboard at `http://localhost:5788`**

### 6.5 Every future run

Just double-click `refresh-dashboard.bat`. No sign-in prompts. Token auto-refreshes silently. Server runs until you close the terminal window.

---

## 7. Configuration constants

Edit these at the top of `scripts/dashboard-server.mjs` if you need to change anything:

```javascript
const PROPERTY_ID = process.env.GA_PROPERTY_ID || '554770810';  // GA4 property ID
const DAYS = 28;                                                // Reporting window
const OAUTH_PORT = 5787;                                        // OAuth callback (temporary)
const SERVE_PORT = 5788;                                        // Dashboard URL: localhost:5788
```

Your GA property ID is in the analytics.google.com URL: `a{accountId}p{propertyId}`. For driftcoconut it's `554770810`.

---

## 8. Cost model

| Component | Cost model | Your actual usage |
|---|---|---|
| **GA Data API** | Free tier: 25,000 requests/day | ~3 requests per refresh = negligible |
| **Gemini 3.5 Flash-Lite** | ~$0.00008 per fresh insight call | ~40 fresh calls/month ≈ **0.10 THB** |
| **Google Cloud infrastructure** | No billing account needed | 0 THB |
| **Total monthly** | | **~0.10 THB (~$0.003)** |

The fingerprint cache means repeated refreshes on unchanged data cost 0 (no API calls made).

---

## 9. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `ERROR: Node.js is not installed` | Node not in PATH | Install from https://nodejs.org (LTS) |
| `Missing ga-oauth-client.json` | Skipped Step 4 above | Complete the OAuth Desktop client setup |
| `Access blocked: Authorization Error` | Wrong Google account picked at sign-in | Delete `ga-token.json`, rerun, pick correct account |
| `Permission denied by GA` | Signed-in account lacks Viewer on the property | GA → Admin → Property access management → Add user |
| `GA Data API not enabled` | Skipped Step 2 above | Enable in APIs & Services → Library |
| `Gemini insight failed (404)` | Model name changed by Google | Update model name in `dashboard-server.mjs` → `generateInsight()` |
| Port 5788 already in use | Prior server didn't shut down cleanly | Wait 60 seconds, or `netstat -ano \| grep :5788` + `taskkill /PID <pid> /F` |
| Dashboard shows stale data | Cached HTML from last run | Click **Update Data** button in the page |

---

## 10. Security notes

- **Service account keys are not used** — this design deliberately uses OAuth Desktop flow to work around org policies blocking service account keys.
- **Tokens are user-scoped** — the cached token only grants access to what your Google account can see in GA. Rotating your account access revokes the dashboard too.
- **Gemini API key** is loaded from `.env.local`, which is gitignored. Never commit it.
- **All credential files are in `.gitignore`** — check `.gitignore` if adding new secrets.
- **The dashboard binds to localhost only** — not reachable from other machines on your network.

---

## 11. What was intentionally excluded

- **No npm dependencies** — uses only Node built-ins (fetch, http, fs, crypto) so `npm install` is never needed
- **No frontend framework** — plain HTML/CSS avoids build steps and bundler complexity
- **No auto-refresh timer** — refreshes are explicit (button click) so you know when API calls happen
- **No historical time-series storage** — snapshot only, always shows last 28 days
- **No multi-user support** — designed for personal single-machine use

---

## 12. Extending it

Reasonable next features (if you want them):
- **Real-time visitor count** — poll GA Realtime API every 30 sec
- **Custom date ranges** — dropdown in header for 7d/28d/90d/custom
- **Historical comparison** — "vs previous 28 days" delta on each KPI
- **Multiple properties** — dropdown to switch between driftcoconut, other sites
- **Export as PDF** — headless Chrome to save the dashboard as PDF
- **Slack/email alerts** — send Gemini insight to your inbox on schedule

The current architecture keeps this simple. Adding any of the above means adding a real dependency (chart library, PDF generator, etc.) and probably a real build step.

---

**Built:** 2026-09-29 · **Model:** Gemini 3.5 Flash-Lite · **GA property:** 554770810 (driftcoconut.com)
