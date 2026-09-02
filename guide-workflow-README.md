# guide-workflow — driftcoconut destination guide desktop app

A 3-tab Windows desktop app that automates the driftcoconut destination-guide writing pipeline. Uses the Claude API directly, so you never leave the app to feed prompts into Perplexity/Gemini and paste back.

## Files

| File | Purpose |
|---|---|
| `guide-workflow.bat` | Double-click launcher. Sets up config on first run. |
| `guide-workflow.ps1` | The actual app (PowerShell + WinForms). |
| `guide-workflow-config.example.json` | Config template (committed). |
| `guide-workflow-config.json` | Your local config (gitignored, holds your Claude API key). |

## First-time setup (2 min)

1. **Get a Claude API key** — sign up at [console.anthropic.com](https://console.anthropic.com/settings/keys). Add $10-$20 of credit; a full guide (research + draft) costs ~$0.30.
2. **Double-click `guide-workflow.bat`** — it will copy the config template to `guide-workflow-config.json` and open it in Notepad.
3. **Paste your API key** into the `claudeApiKey` field, save, close Notepad.
4. **Press any key** to launch the app.
5. **`.gitignore`** — add this line so your config never gets committed:
   ```
   guide-workflow-config.json
   ```

## The 3 tabs (workflow left-to-right)

### Tab 1 — Research

- Fill **Destination** (e.g. `Chiang Mai`), **Country** (e.g. `Thailand`), **Publish month** (e.g. `September 2026`)
- The research prompt auto-generates in the middle textbox
- Click **"Run Claude Research"** — Claude runs the prompt, output fills the bottom textbox (30–90 sec)
- Or paste an existing Perplexity output into the bottom textbox
- Click **"Save research.md"** — writes to `guides-drafts/<slug>/research.md`

### Tab 2 — Notes → Draft + Voice

- Write your **personal notes** in the top textbox (5–15 lines is enough — coffee shops, opinions, insider tips)
- Click **"Save notes.md"** to persist between sessions
- Click **"Run Claude Draft"** — Claude gets the research + your notes + the brand-voice prompt, drafts the guide in the bottom textbox (60–120 sec)
- Or paste from Gemini/Perplexity
- Click **"SAVE DRAFT"** — writes `draft.md` + `final.md`, runs AI-phrase scan (flags "vibrant tapestry", "must-visit", etc.), reports word count vs 1,900–2,200 target

### Tab 3 — Photos + Publish

- Fill the **metadata fields** (title, description, destination, hero alt)
- For each of the **8 photo slots**, click **"Pick..."** and select a JPG on your disk
- Click **"Copy Photos → public/guides/<slug>/"** — copies + renames each to the canonical filename
- Click **"Assemble final.mdx"** — reads `final.md`, wraps common affiliate anchor phrases (`Browse X hotels on Booking.com`, `book Y on Klook`, etc.) with proper JSX, adds frontmatter, saves to `guides-drafts/<slug>/final.mdx`
- Click **"Publish → content/guides/<slug>.mdx"** — copies the assembled MDX into the site's published guides folder

Then in your normal terminal:

```powershell
git add content/guides public/guides
git commit -m "Publish <city> guide"
git push
```

Vercel auto-deploys in ~90 seconds.

## Files this app touches

| Folder | Purpose |
|---|---|
| `guides-drafts/<slug>/` | Working files — never committed. Contains `research.md`, `notes.md`, `draft.md`, `final.md`, `final.mdx` |
| `public/guides/<slug>/` | Published photos (8 files named `hero.jpg`, `when-to-go.jpg`, etc.) — committed |
| `content/guides/<slug>.mdx` | Published guide, read by `/guides/<slug>` route — committed |

## Photo slot names (must match GuidePhoto.tsx)

The app expects 8 photos named exactly:
- `hero.jpg`
- `when-to-go.jpg`
- `sukhumvit.jpg`
- `silom.jpg`
- `riverside.jpg`
- `old-town.jpg`
- `activity.jpg`
- `local-tips.jpg`

These slot names are shared across all guides (Bangkok, Chiang Mai, etc.). If you want per-guide slot names (e.g., `nimman.jpg` for Chiang Mai), refactor `components/GuidePhoto.tsx` first to accept `{guideSlug, slot}` lookups.

## Config options (`guide-workflow-config.json`)

| Field | Default | Notes |
|---|---|---|
| `claudeApiKey` | *(required)* | Your Anthropic API key. Starts with `sk-ant-`. |
| `claudeModel` | `claude-sonnet-4-5` | Alternatives: `claude-opus-5` (higher quality, 5x cost), `claude-haiku-4-5` (fast/cheap) |
| `claudeMaxTokens` | `8000` | Response cap. Raise to 16000 for very long research or draft outputs. |

You can also set the env var `ANTHROPIC_API_KEY` instead of using the config file — the app checks env first, then config.

## Cost estimate per guide

Using Sonnet:
- Research call: ~3K input tokens + ~5K output = ~$0.09
- Draft call: ~15K input tokens (research + notes + prompt) + ~4K output = ~$0.11
- **Total per guide: ~$0.20**

$20 of Anthropic credit = ~100 guide iterations.

## Troubleshooting

**"Claude API key not configured"** — Edit `guide-workflow-config.json` and paste your key.

**"Claude API error: 401 Unauthorized"** — Key is wrong or expired. Check at console.anthropic.com.

**"Claude API error: rate_limit_error"** — You've hit Anthropic's rate limits (usually only a concern on the free tier). Wait 60 seconds and retry.

**App is invisible / tabs blank on Windows 11** — Already handled by the manual Panel+Buttons tab bar (session.md bug #1). If you still see issues, restart PowerShell.

**Drag-drop not working on text boxes** — The app uses RichTextBox which accepts drag but the drop handler wasn't wired for v1. Workaround: use the "Load" buttons, or paste text with Ctrl+V.

**`Get-Content: file is being used by another process`** — Close whatever text editor has the file open, then retry.

## Session notes provenance

This app is the v3 rebuild described in `session.md` §2, with a Claude API integration added (previously required copying prompts to Perplexity and pasting back). All 6 bug fixes from §3 of session.md are applied:

1. Manual Panel+Buttons tab bar (TabControl invisible on some W11)
2. RichTextBox for text areas (not TextBox)
3. Scriptblocks wrapped in `.GetNewClosure()`
4. All state uses `$global:` (not `$script:`)
5. Explicit DialogResult enum comparison
6. Long-paste reliability (right-click paste + scroll-verify)

## Adding new guides

For each new destination:

1. Open the app
2. Update the **slug** in the header (e.g., `bali`)
3. Change **Destination** + **Country** in Tab 1
4. Follow tabs left-to-right
5. Metadata + photo slots are pre-filled per guide (edit as needed on Tab 3)

The slug drives all paths — `guides-drafts/bali/`, `public/guides/bali/`, `content/guides/bali.mdx`.

---

Built for driftcoconut · v3.1 (Claude API edition) · 2026-09
