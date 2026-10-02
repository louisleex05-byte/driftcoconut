# guide-workflow — driftcoconut destination guide desktop app

This Windows desktop app supports the driftcoconut destination-guide pipeline from research through a locally prepared MDX file. During the GPT transition, the supported default is manual ChatGPT mode: the app builds the prompt, copies it, opens ChatGPT, and accepts the result pasted back into the app.

The existing direct Claude API integration remains temporarily available as a disabled legacy option. Replacing that API implementation is a later phase.

## Files

| File | Purpose |
|---|---|
| `guide-workflow.bat` | Double-click launcher; creates the ignored local config on first run. |
| `guide-workflow.ps1` | PowerShell and WinForms workflow application. |
| `guide-workflow-config.example.json` | Safe config template committed to Git. |
| `guide-workflow-config.json` | Local ignored settings; never commit this file. |
| `VOICE.md` | Canonical guide voice, structure, sourcing, and phrase rules. |
| `AGENTS.md` | Repository, validation, Git, and publishing safeguards. |

## First-time setup

1. Double-click `guide-workflow.bat`.
2. The launcher creates `guide-workflow-config.json` if it is missing.
3. The app opens in manual GPT mode. No API key is required.
4. Keep `guide-workflow-config.json` local; it is already covered by `.gitignore`.

## Workflow

### 1. Research

1. Enter the destination, country, and intended publication month.
2. Leave **ChatGPT** selected under **Send to**.
3. Click **Copy + Open**. The prompt is copied and ChatGPT opens in the browser.
4. Paste the prompt into ChatGPT, then paste its answer into **Research output**.
5. Review citations and volatile facts, then save `research.md`.

Perplexity, Gemini, and Claude remain available in the tool dropdown when a second source or comparison is useful.

### 2. Notes, draft, and voice

1. Add personal notes that supply firsthand opinions and local detail.
2. Save `notes.md` if you want to preserve the notes between sessions.
3. Leave **ChatGPT** selected and click **Copy + Open** to send the assembled research, notes, and editorial prompt.
4. Paste the returned guide into **Draft body**.
5. Review it against `VOICE.md`, then click **SAVE DRAFT**.

Saving writes `draft.md` and `final.md`, reports the word count, and scans for the banned phrases defined in the workflow and `VOICE.md`.

### 3. Photos and local preparation

1. Review the metadata fields and the destination-specific photo preset.
2. Select a source image for each photo slot.
3. Click **Copy Photos** to copy, rename, and compress images under `public/guides/<slug>/`.
4. Click **Assemble final.mdx** to add frontmatter and photo components, wrap supported plain affiliate phrases, preserve existing affiliate components, and remove legacy arrow prefixes.
5. Review `guides-drafts/<slug>/final.mdx`.
6. Click **Prepare** to copy the reviewed MDX into `content/guides/<slug>.mdx`.

Prepare is intentionally local-only. It refuses to run on `main` and never stages, commits, pushes, deploys, or calls IndexNow.

## Review and Git approval

After preparing a guide, review the exact paths that changed and run the required validation:

```powershell
git status --short
git diff -- content/guides/<slug>.mdx components/GuidePhoto.tsx
npm run build
```

Stage only explicit reviewed paths. Do not use `git add -A` or `git add .`. Before every commit, present the changed files, a short summary, validation results, and the proposed commit message; wait for approval. A push requires separate explicit approval and must not target `main` without authorization.

## Working and published paths

| Path | Purpose |
|---|---|
| `guides-drafts/<slug>/` | Ignored working files: research, notes, drafts, and assembled MDX. |
| `public/guides/<slug>/` | Prepared destination photos using the preset's canonical filenames. |
| `content/guides/<slug>.mdx` | Prepared English guide. |
| `content/guides/<slug>.zh.mdx` | Chinese guide paired with the English guide. |
| `components/GuidePhoto.tsx` | Maps each guide slug and slot to its image and alt text. |

The guide slug, selected preset, metadata, MDX filename, photo directory, and `GuidePhoto.tsx` entry must agree. Preparation stops when an MDX photo slot has no matching component entry.

## Affiliate handling

The assembler preserves complete existing `<AffiliateLink>` components and wraps supported plain-text prompts only outside those components. Supported types include:

- Booking.com
- MakeMyTrip and Goibibo through CueLinks
- Klook
- Welcome Pickups
- Airalo
- Kiwi
- Drimsim

Booking.com, MakeMyTrip, and Goibibo links require a meaningful `query`. Affiliate component lines must not start with `->` or `→`.

## Configuration

Manual GPT mode needs no credentials. These fields remain only for the temporary legacy Claude path:

| Field | Default | Purpose |
|---|---|---|
| `useClaudeAPI` | `false` | Explicitly enables the legacy direct API controls. |
| `claudeApiKey` | empty | Local Anthropic API key used only by the legacy path. |
| `claudeModel` | `claude-sonnet-4-5` | Legacy model setting. |
| `claudeMaxTokens` | `8000` | Legacy response cap. |

The app also reads `ANTHROPIC_API_KEY` for backward compatibility. Never commit credentials.

## Troubleshooting

**ChatGPT did not receive the prompt** — **Copy + Open** copies the prompt to the clipboard; paste it into the browser with Ctrl+V.

**Legacy API button is disabled** — This is expected in manual GPT mode. Leave **Use legacy Claude API** unchecked.

**Prepare refuses to run** — Confirm the repository is on a feature branch, the guide slug matches the selected preset, and every `<GuidePhoto>` slot exists in `GuidePhoto.tsx`.

**App is invisible or tabs are blank on Windows 11** — Restart the app through `guide-workflow.bat`. The workflow uses manual panels instead of `TabControl` for compatibility.

**A draft triggers the AI-phrase warning** — Replace every flagged phrase with a concrete destination-specific detail and review the full checklist in `VOICE.md`.

## Preserved WinForms behavior

The workflow retains the compatibility fixes established during the v3 rebuild:

1. Manual panel-and-button tabs.
2. `RichTextBox` text areas.
3. Event handlers closed with `.GetNewClosure()`.
4. Shared UI state under `$global:`.
5. Explicit `DialogResult` comparisons.
6. Load and paste controls for long text.

Built for driftcoconut · GPT transition architecture · 2026-10
