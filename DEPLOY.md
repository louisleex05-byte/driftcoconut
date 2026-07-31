# Deploy in 5 steps — get a live URL for Agoda verification

Total time: ~15 minutes. Everything is free.

## Prerequisites (one-time)

Install these on your computer if you don't have them:

```bash
# GitHub CLI (for pushing to GitHub)
# Windows: winget install --id GitHub.cli
# Mac:     brew install gh

# Vercel CLI (for deploying)
npm install -g vercel
```

Sign in once:

```bash
gh auth login          # follow browser prompts
vercel login           # follow browser prompts (use your GitHub account)
```

---

## Step 1 — Push to GitHub

The git repo is already initialized with an initial commit. Just create the remote and push:

```bash
cd "C:\Users\Admin\Downloads\Travel Site"
gh repo create travel-site --public --source=. --push
```

This creates `github.com/<your-username>/travel-site` and pushes.

## Step 2 — Deploy to Vercel

From the same folder:

```bash
vercel
```

Answers to the prompts:
- **Set up and deploy?** → `Y`
- **Which scope?** → your personal account
- **Link to existing project?** → `N`
- **Project name?** → `travel-site` (or press Enter)
- **Directory?** → `.` (press Enter)
- **Modify settings?** → `N`

You'll get a URL like `https://travel-site-abc123.vercel.app`. **Copy it.**

## Step 3 — Add env vars in Vercel

Open the Vercel dashboard → your project → **Settings → Environment Variables**.

Add these (all three environments: Production, Preview, Development):

| Name | Value | Notes |
|---|---|---|
| `AGODA_MOCK` | `true` | Keeps mock data active while API pending |
| `AGODA_SITE_ID` | *(leave blank for now)* | Fill in once approved |
| `AGODA_API_KEY` | *(leave blank for now)* | Fill in once approved |

Then redeploy so the env vars take effect:

```bash
vercel --prod
```

## Step 4 — Submit URL to Agoda

1. Go to `partners.agoda.com` → **Profile → Manage Your Sites**
2. Add your Vercel URL (from Step 2)
3. Click **Verify Domain** at the top of the page

Agoda will give you one of two verification methods:
- **Meta tag** — copy the tag content and add it as `NEXT_PUBLIC_AGODA_VERIFICATION` in Vercel env vars (Step 5)
- **File upload** — save the file they give you as `public/agoda-verification.html` in the project, commit, and Vercel redeploys automatically

## Step 5 — Add the verification meta tag (if that method)

If Agoda gives you a meta tag like:

```html
<meta name="agoda-site-verification" content="xxxxx-yyyyy-zzzzz" />
```

Just add the `content` value to Vercel:

```
NEXT_PUBLIC_AGODA_VERIFICATION=xxxxx-yyyyy-zzzzz
```

Redeploy: `vercel --prod`. Then click **Verify** in the Agoda dashboard.

The `layout.tsx` file already injects this tag automatically when the env var is set — no code changes needed.

---

## Once Agoda approves your account

1. Go to Agoda dashboard → **Tools → API** → generate your API key
2. Update Vercel env vars:
   - `AGODA_MOCK` → `false`
   - `AGODA_SITE_ID` → your CID
   - `AGODA_API_KEY` → your key
3. `vercel --prod` — your site now serves live hotel data with your affiliate tracking

## Future updates

Any `git push` to `main` triggers automatic Vercel deploy. Workflow:

```bash
# make changes
git add -A
git commit -m "add hotel detail page"
git push
# → live in ~30 seconds
```
