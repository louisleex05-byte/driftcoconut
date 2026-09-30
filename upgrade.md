# GA Dashboard Upgrade — Gemini-only (uses your existing key)

Upgrades an existing driftcoconut GA dashboard (the one started by `refresh-dashboard.bat`) to the latest version.

- **One file changes:** `scripts/dashboard-server.mjs`
- **No new API key needed.** The laptop keeps using its existing `GEMINI_API_KEY` (the shared Mr. Durian prepay key) and its existing model, `gemini-3.5-flash-lite`.
- **Nothing to add to `.env.local`.** With no `OPENAI_API_KEY` present, the script skips OpenAI and goes straight to Gemini.

Reference version: **1035 lines**, MD5 `eedd93cdb8b8c31929df2080a481ebe0`
(check with `certutil -hashfile scripts\dashboard-server.mjs MD5` in Command Prompt).

---

## What you get

| # | Feature | Where on the page |
|---|---|---|
| 1 | **3-paragraph AI summary**: situation, audience, opportunity (was 2 paragraphs) | Purple AI panel |
| 2 | **Retry / Rewrite button** always visible (Retry after a failure, Rewrite after success) | Purple AI panel |
| 3 | **Header shows the model that actually wrote the summary** | Purple AI panel |
| 4 | **💬 What This Means** — about 10 automatic plain-English findings (green / amber / red / blue cards). Free, no AI call. | Right under the AI panel |
| 5 | **📈 Growth** — visitors-per-day bar chart plus this week vs last week | Section 2 |
| 6 | **🔎 Google Search** — times shown, clicks, click rate, average rank, search words, pages Google shows (needs Search Console linked to GA) | Section 3 |
| 7 | **🎯 What Visitors Do** — engagement stats, actions taken (event names translated), how people arrive, first landing pages | Section 4 |
| 8 | **🌏 Audience** — active users, countries (with flags), cities, device, new vs returning, age and gender | Section 5 |
| 9 | Startup log line showing whether the Gemini key loaded | Terminal |
| 10 | Every new report loads separately: if one fails, only that card goes empty (terminal prints `skipped`) | Terminal |

Unchanged: KPIs, self-traffic estimate, top pages, traffic sources, language split, Update Data button, insight caching.

### AI model used on the laptop (Gemini only)

1. `gemini-3.5-flash-lite` (same model as today)
2. `gemini-3.5-flash` (automatic backup if the first one fails)

If you ever add an `OPENAI_API_KEY` to `.env.local`, OpenAI becomes the first choice. Leave it out to stay on Gemini.

### Cost

Refresh Data is free (Google Analytics API). Only a fresh or Rewritten summary calls Gemini. Unchanged data reuses the cached summary at no cost. The new summary sends more data than before, so estimate roughly $0.0001 (about 0.004 THB) per summary, which your prepay balance covers for a very long time.

---

## Upgrade steps (about 3 minutes)

### 1. Stop the dashboard
Close the terminal window running `refresh-dashboard.bat`. Windows locks the file while it runs.

### 2. Back up the old file
In the laptop's `Travel Site\scripts\` folder, copy `dashboard-server.mjs` to `dashboard-server.mjs.bak`.

### 3. Copy the new file
Copy `scripts\dashboard-server.mjs` from the main PC's `Travel Site` folder over the laptop's copy. Any of these work: USB stick, OneDrive/Google Drive, email to yourself, or `git pull` if the file has been committed and pushed.

### 4. Leave `.env.local` alone
Just confirm it still has a line starting with `GEMINI_API_KEY=` (the key that already works on the laptop's bot page). Do not add an OpenAI line.

### 5. Clear the old cached summary
Delete `Travel Site\ga-insight-cache.json` if it exists. The next run then writes a fresh 3-paragraph summary using the new data.

### 6. Start it
Double-click `refresh-dashboard.bat`.

---

## How to confirm it worked

**Terminal should show, in order:**

```
🔑 Gemini key loaded: (first 12 characters)... (length)
📊 Fetching last 28 days from GA property 554770810...
🤖 Trying gemini: gemini-3.5-flash-lite...
✅ AI insight generated via gemini-3.5-flash-lite
✅ Refreshed: ... views · ... sessions
🌐 Dashboard live at: http://localhost:5788
```

There is no OpenAI line, which is correct.

**Browser at http://localhost:5788 should show, top to bottom:**
AI panel (3 paragraphs, `gemini-3.5-flash-lite` in the header, Rewrite button), then 💬 What This Means, 📈 Growth, 🔎 Google Search, 🎯 What Visitors Do, 🌏 Audience, 🕵️ Estimated Self-Generated Traffic, Top Pages, Traffic Sources and Language Split.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `EPERM ... rename` when saving the file | Dashboard is still running | Close the terminal window first |
| Terminal says `No GEMINI_API_KEY found` | Key line missing or misspelled in `.env.local` | Add `GEMINI_API_KEY=` with the key from the bot page. Name must be UPPERCASE, one line only. |
| `402 prepayment credits are depleted` | Google prepay billing sync problem (seen on the main PC). Not caused by this code. | Wait it out and click Retry, or use the key the bot page uses |
| `404 ... no longer available` for a model | Google retired that model | Change the model names on line 375 of the script |
| Empty or cut-off summary (`empty_response` in the terminal) | Gemini used its output limit on internal reasoning | Click Retry. If it keeps happening, raise `maxOutputTokens: 900` to `1500` in the script. |
| `Audience report "age" skipped` or `"gender" skipped` | Google Signals is off, or too few users | Normal. Optional: GA → Admin → Data collection and modification → Data collection → turn on Google signals |
| Google Search card says "not available" | Search Console isn't linked to this GA property | GA → Admin → Product links → Search Console links |
| Purple panel shows a Retry button and an error | Gemini call failed | Read the terminal's last `❌ All AI models failed` line, fix that, click Retry |
| Page opens but sections are missing | Old file still in place, or old cache | Re-copy the file, confirm 1035 lines, restart |
| Browser asks for Google sign-in again | Token expired or `ga-token.json` missing | Sign in once. The token is cached again. |

---

## Files the laptop needs (only if this is a fresh install)

Already there if the dashboard has run before. Otherwise copy from the main PC, or run `install-dashboard.bat`.

| File | Purpose | Commit to git? |
|---|---|---|
| `scripts/dashboard-server.mjs` | Dashboard (the upgraded file) | Yes |
| `refresh-dashboard.bat` | Daily launcher | Yes |
| `install-dashboard.bat` | One-time setup wizard | Yes |
| `ga-oauth-client.json` | Google OAuth client (secret) | **No** |
| `ga-token.json` | Cached sign-in token (secret) | **No** |
| `.env.local` | API keys (secret) | **No** |
| `ga-dashboard.html`, `ga-insight-cache.json` | Generated output | **No** |

Fixed settings inside the script (change only if needed):
GA property `554770810`, window `28` days, sign-in port `5787`, dashboard port `5788`.

---

## Rollback

Close the dashboard, delete `scripts\dashboard-server.mjs`, rename `dashboard-server.mjs.bak` back to `dashboard-server.mjs`, and restart.

---

## Note on `dashboard.md`

`dashboard.md` still describes the older 2-paragraph version. This file (`upgrade.md`) is the current reference.

---

## One-paragraph brief for Claude on the laptop (optional)

> Upgrade my GA dashboard. Replace `scripts/dashboard-server.mjs` with the new version (1035 lines) I copied over. Keep using my existing `GEMINI_API_KEY` in `.env.local` and do not add any OpenAI key. Delete `ga-insight-cache.json`, run `node --check scripts/dashboard-server.mjs`, then tell me to restart `refresh-dashboard.bat`. Do not print my keys.
