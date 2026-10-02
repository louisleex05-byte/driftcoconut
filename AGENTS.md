# Repository instructions

These instructions apply to the entire repository.

## Project

driftcoconut is a Next.js 15 travel affiliate site with English and Chinese destination guides. The local Windows guide workflow is implemented in `guide-workflow.ps1` and launched by `guide-workflow.bat`.

## Git and publishing safety

- Do all transition work on `gpt-transition`. Confirm the current branch before editing or committing.
- Treat `main` as production. Do not switch to, edit, reset, merge into, push to, or delete `main` without the user's explicit approval.
- Never let the guide workflow commit or push automatically. Publishing may prepare or copy reviewed files, but a human must explicitly approve each commit and each push.
- Before every commit, show the user the files changed, a short summary, validation results, and the proposed commit message. Wait for approval before committing.
- Do not push unless the user separately authorizes the push.
- Stage explicit, reviewed paths only. Never use `git add -A` or `git add .` in the publishing workflow.
- Do not add the untracked source-photo folders at the repository root unless the user explicitly asks. In particular, preserve `Cha am/`, `Koh Chang/`, `Koh Lanta/`, `Koh Phangan/`, `Koh Tao/`, and `Sukhothai/` as untracked.
- Preserve unrelated user changes in a dirty worktree.

## Guide content

- Follow `VOICE.md` for English guide voice, structure, sourcing, and banned phrases.
- Treat English and Chinese guide files as pairs: `content/guides/<slug>.mdx` and `content/guides/<slug>.zh.mdx`. When changing shared structure, photos, or affiliate placement, check both variants.
- Keep frontmatter valid and preserve MDX components such as `<AffiliateLink>` and `<GuidePhoto>`.
- Do not invent facts, prices, dates, visa rules, safety advice, or citations. Flag uncertainty for review.
- Keep guide working files under `guides-drafts/<slug>/`; this directory is ignored by Git.

## Affiliate links

- Preserve valid `<AffiliateLink>` tags during prompt generation, draft saving, assembly, translation, and formatting.
- Supported affiliate types include `booking`, `makemytrip`, `goibibo`, `klook`, `welcomePickups`, `airalo`, `kiwi`, and `drimsim`.
- `booking`, `makemytrip`, and `goibibo` require a meaningful `query`.
- MakeMyTrip and Goibibo use the CueLinks helpers in `lib/cuelinks.ts`; do not replace them with untracked raw URLs.
- Affiliate links must retain `rel="sponsored noopener noreferrer"` behavior through `components/AffiliateLink.tsx`.
- Do not leave `->` or `→` prefixes before `<AffiliateLink>` lines.

## Guide workflow invariants

- Keep the WinForms compatibility decisions in `guide-workflow.ps1`: manual panel-based tabs, `RichTextBox` inputs, `.GetNewClosure()` event handlers, `$global:` UI state, and explicit `DialogResult` comparisons.
- The active guide slug, photo preset, metadata, MDX destination, and `GuidePhoto.tsx` mapping must agree before publishing.
- Keep the photo-coverage check that blocks publishing when an MDX photo slot has no matching `GuidePhoto.tsx` entry.
- Keep local configuration and secrets out of Git. `guide-workflow-config.json`, API keys, OAuth credentials, and tokens must remain ignored.
- The GPT transition should update only the workflow, config template, launcher text, and related documentation needed for the transition. Avoid unrelated application or guide rewrites.

## Validation

After each logical group of changes:

1. Review `git diff` and `git status --short`.
2. Parse `guide-workflow.ps1` with the PowerShell parser and report every syntax error.
3. Run `npm run build`.
4. Run focused guide and affiliate checks relevant to the change, including malformed affiliate prefixes, supported affiliate types, required queries, and preservation of existing tags.

Do not stage, commit, push, merge, or touch `main` as part of validation.
