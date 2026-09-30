// Persistent local dashboard server.
// - Serves ga-dashboard.html at http://localhost:5788
// - "Update Data" button in the page POSTs to /refresh to pull fresh GA data
// - Opens the browser on startup; press Ctrl+C or close the terminal to stop
//
// One-time setup identical to refresh-dashboard.bat comments.

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const OAUTH_CLIENT_FILE = path.join(PROJECT_ROOT, 'ga-oauth-client.json');
const TOKEN_FILE = path.join(PROJECT_ROOT, 'ga-token.json');
const OUTPUT = path.join(PROJECT_ROOT, 'ga-dashboard.html');
const INSIGHT_CACHE = path.join(PROJECT_ROOT, 'ga-insight-cache.json');
const PROPERTY_ID = process.env.GA_PROPERTY_ID || '554770810';
const DAYS = 28;
const OAUTH_PORT = 5787;
const OAUTH_REDIRECT_URI = `http://localhost:${OAUTH_PORT}`;
const SERVE_PORT = 5788;
const SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';

function die(msg) { console.error('\n❌ ' + msg + '\n'); process.exit(1); }
function openUrl(url) {
  spawn('rundll32', ['url.dll,FileProtocolHandler', url], { detached: true, stdio: 'ignore' }).unref();
}

// Load GEMINI_API_KEY from .env.local (Next.js pattern) — used for AI insights.
function readEnvKey(name) {
  try {
    const p = path.join(PROJECT_ROOT, '.env.local');
    if (!fs.existsSync(p)) return null;
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(new RegExp(`^\\s*${name}\\s*=\\s*(.+?)\\s*$`, 'i'));
      if (m) return m[1].replace(/^["']|["']$/g, '');
    }
  } catch {}
  return null;
}
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || readEnvKey('GEMINI_API_KEY');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || readEnvKey('OPENAI_API_KEY');
if (OPENAI_API_KEY) console.log(`🔑 OpenAI key loaded: ${OPENAI_API_KEY.slice(0,8)}... (${OPENAI_API_KEY.length} chars)${OPENAI_API_KEY.startsWith('sk-') ? '' : '  ⚠️ does not start with sk- — check for a typo'}`);
if (GEMINI_API_KEY) console.log(`🔑 Gemini key loaded: ${GEMINI_API_KEY.slice(0,12)}... (${GEMINI_API_KEY.length} chars)`);
else console.log(`⚠️  No GEMINI_API_KEY found in env or .env.local — AI insights disabled`);

// ==================== OAuth ====================
if (!fs.existsSync(OAUTH_CLIENT_FILE)) {
  die(
    `Missing ga-oauth-client.json in project root.\n` +
    `Run the one-time setup from refresh-dashboard.bat comments, then relaunch.`
  );
}
const { client_id, client_secret } = (JSON.parse(fs.readFileSync(OAUTH_CLIENT_FILE, 'utf8')).installed || {});
if (!client_id) die('ga-oauth-client.json missing client_id.');

async function getAccessToken(interactiveOk = true) {
  if (fs.existsSync(TOKEN_FILE)) {
    const cached = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
    if (cached.access_token && cached.expires_at && Date.now() < cached.expires_at - 60_000) {
      return cached.access_token;
    }
    if (cached.refresh_token) {
      const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ client_id, client_secret, refresh_token: cached.refresh_token, grant_type: 'refresh_token' }).toString(),
      });
      if (res.ok) {
        const t = await res.json();
        const updated = { ...cached, access_token: t.access_token, expires_at: Date.now() + (t.expires_in * 1000) };
        fs.writeFileSync(TOKEN_FILE, JSON.stringify(updated, null, 2));
        return t.access_token;
      }
    }
  }
  if (!interactiveOk) throw new Error('Token expired and no interactive auth allowed');

  console.log('\n🔐 First-run authorization needed. Opening browser...');
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', client_id);
  authUrl.searchParams.set('redirect_uri', OAUTH_REDIRECT_URI);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', SCOPE);
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');

  const code = await new Promise((resolve, reject) => {
    const srv = http.createServer((req, res) => {
      const u = new URL(req.url, OAUTH_REDIRECT_URI);
      const c = u.searchParams.get('code');
      const err = u.searchParams.get('error');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      if (err) { res.end(`<h2>Error: ${err}</h2>`); srv.close(); reject(new Error(err)); }
      else if (c) { res.end(`<div style="font-family:system-ui;padding:60px;text-align:center;color:#0f2540"><h2 style="color:#16a34a">✓ Authorized</h2><p>Close this tab — the dashboard is loading.</p></div>`); srv.close(); resolve(c); }
      else res.end('Waiting...');
    });
    srv.listen(OAUTH_PORT, () => {
      const url = authUrl.toString();
      console.log(`\n>>> Browser should open. If not, paste manually:\n\n${url}\n`);
      openUrl(url);
    });
    setTimeout(() => { srv.close(); reject(new Error('Sign-in timed out.')); }, 180_000);
  });

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id, client_secret, code, redirect_uri: OAUTH_REDIRECT_URI, grant_type: 'authorization_code' }).toString(),
  });
  if (!tokenRes.ok) die(`Token exchange failed: ${await tokenRes.text()}`);
  const tokens = await tokenRes.json();
  fs.writeFileSync(TOKEN_FILE, JSON.stringify({
    access_token: tokens.access_token, refresh_token: tokens.refresh_token,
    expires_at: Date.now() + (tokens.expires_in * 1000), scope: tokens.scope,
  }, null, 2));
  console.log('✓ Signed in. Token cached.\n');
  return tokens.access_token;
}

// ==================== GA fetch + HTML build ====================
async function fetchAndBuild({ forceInsight = false } = {}) {
  const accessToken = await getAccessToken();
  const dateRange = { startDate: `${DAYS}daysAgo`, endDate: 'today' };

  async function runReport(body) {
    const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      let parsed = {}; try { parsed = JSON.parse(text); } catch {}
      const reason = parsed?.error?.details?.[0]?.reason;
      const activationUrl = parsed?.error?.details?.[0]?.metadata?.activationUrl;
      if (reason === 'SERVICE_DISABLED' && activationUrl) throw new Error(`GA Data API not enabled. Enable at:\n${activationUrl}`);
      if (res.status === 403) throw new Error(`GA permission denied on property ${PROPERTY_ID}. Verify Viewer access in GA → Admin → Property access management.`);
      throw new Error(`GA API ${res.status}: ${text.slice(0, 300)}`);
    }
    return res.json();
  }

  console.log(`📊 Fetching last ${DAYS} days from GA property ${PROPERTY_ID}...`);
  const [totals, topPages, sources] = await Promise.all([
    runReport({ dateRanges: [dateRange], metrics: [{ name: 'screenPageViews' }, { name: 'sessions' }, { name: 'activeUsers' }, { name: 'bounceRate' }] }),
    runReport({ dateRanges: [dateRange], dimensions: [{ name: 'pageTitle' }], metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }, { name: 'bounceRate' }], orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 10 }),
    runReport({ dateRanges: [dateRange], dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }], metrics: [{ name: 'sessions' }], orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 15 }),
  ]);

  // ---- Audience reports (each isolated: a failure just hides that card) ----
  const safe = (label, body) => runReport(body).catch(e => { console.log(`⚠️  Audience report "${label}" skipped: ${String(e.message).slice(0, 120)}`); return null; });
  const audRep = (dims, limit = 10) => ({
    dateRanges: [dateRange],
    dimensions: dims.map(name => ({ name })),
    metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
    limit,
  });
  const [aCountry, aCity, aDevice, aNewRet, aAge, aGender] = await Promise.all([
    safe('country', audRep(['country', 'countryId'], 12)),
    safe('city', audRep(['city'], 10)),
    safe('device', audRep(['deviceCategory'], 5)),
    safe('newVsReturning', audRep(['newVsReturning'], 3)),
    safe('age', audRep(['userAgeBracket'], 8)),
    safe('gender', audRep(['userGender'], 3)),
  ]);
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  const rowsOf = rep => (rep?.rows || []).map(r => {
    const dims = r.dimensionValues.map(v => v.value);
    const nm = (dims[0] === '(not set)' || !dims[0]) ? 'Unknown' : cap(dims[0]);
    return { name: nm, id: dims[1], users: Number(r.metricValues[0].value), sessions: Number(r.metricValues[1]?.value || 0) };
  });
  const audience = {
    countries: rowsOf(aCountry), cities: rowsOf(aCity), devices: rowsOf(aDevice),
    newRet: rowsOf(aNewRet), age: rowsOf(aAge), gender: rowsOf(aGender),
  };

  // ---- Extra reports: trend, engagement, events, channels, landing pages, Google Search ----
  const mk = ({ dims = [], mets, order, desc = true, limit, range = dateRange }) => ({
    dateRanges: [range],
    dimensions: dims.map(name => ({ name })),
    metrics: mets.map(name => ({ name })),
    ...(order === 'date' ? { orderBys: [{ dimension: { dimensionName: 'date' } }] } : order ? { orderBys: [{ metric: { metricName: order }, desc }] } : {}),
    ...(limit ? { limit } : {}),
  });
  const SEO = ['organicGoogleSearchImpressions', 'organicGoogleSearchClicks', 'organicGoogleSearchAveragePosition'];
  const [xWk, xWkPrev, xDaily, xEng, xEvents, xChannels, xLanding, xSeoTot, xSeoQ, xSeoP] = await Promise.all([
    safe('week', mk({ mets: ['activeUsers', 'sessions', 'screenPageViews'], range: { startDate: '6daysAgo', endDate: 'today' } })),
    safe('prev week', mk({ mets: ['activeUsers', 'sessions', 'screenPageViews'], range: { startDate: '13daysAgo', endDate: '7daysAgo' } })),
    safe('daily', mk({ dims: ['date'], mets: ['activeUsers', 'sessions'], order: 'date', limit: 60 })),
    safe('engagement', mk({ mets: ['engagementRate', 'userEngagementDuration', 'activeUsers', 'screenPageViewsPerSession', 'engagedSessions', 'sessions'] })),
    safe('events', mk({ dims: ['eventName'], mets: ['eventCount', 'totalUsers'], order: 'eventCount', limit: 20 })),
    safe('channels', mk({ dims: ['sessionDefaultChannelGroup'], mets: ['sessions', 'engagedSessions'], order: 'sessions', limit: 8 })),
    safe('landing pages', mk({ dims: ['landingPage'], mets: ['sessions', 'engagementRate'], order: 'sessions', limit: 8 })),
    safe('search totals', mk({ mets: ['organicGoogleSearchImpressions', 'organicGoogleSearchClicks', 'organicGoogleSearchClickThroughRate', 'organicGoogleSearchAveragePosition'] })),
    safe('search queries', mk({ dims: ['organicGoogleSearchQuery'], mets: SEO, order: 'organicGoogleSearchImpressions', limit: 10 })),
    safe('search pages', mk({ dims: ['landingPagePlusQueryString'], mets: SEO, order: 'organicGoogleSearchImpressions', limit: 8 })),
  ]);
  const mv = (rep, i) => Number(rep?.rows?.[0]?.metricValues?.[i]?.value || 0);
  const wkOf = rep => ({ users: mv(rep, 0), sessions: mv(rep, 1), views: mv(rep, 2) });
  const more = {
    wk: xWk && xWkPrev ? { cur: wkOf(xWk), prev: wkOf(xWkPrev) } : null,
    daily: (xDaily?.rows || []).map(r => ({ date: r.dimensionValues[0].value, users: Number(r.metricValues[0].value), sessions: Number(r.metricValues[1].value) })),
    eng: xEng ? {
      rate: mv(xEng, 0), avgTimeSec: mv(xEng, 1) / Math.max(mv(xEng, 2), 1),
      pagesPerSession: mv(xEng, 3), engagedSessions: mv(xEng, 4), sessions: mv(xEng, 5),
    } : null,
    events: (xEvents?.rows || []).map(r => ({ name: r.dimensionValues[0].value, count: Number(r.metricValues[0].value), users: Number(r.metricValues[1].value) })),
    channels: (xChannels?.rows || []).map(r => ({ name: r.dimensionValues[0].value, sessions: Number(r.metricValues[0].value), engaged: Number(r.metricValues[1].value) })),
    landing: (xLanding?.rows || []).map(r => ({ page: r.dimensionValues[0].value, sessions: Number(r.metricValues[0].value), rate: Number(r.metricValues[1].value) })),
    seo: {
      has: !!xSeoTot,
      impressions: mv(xSeoTot, 0), clicks: mv(xSeoTot, 1), ctr: mv(xSeoTot, 2) * 100, pos: mv(xSeoTot, 3),
      queries: (xSeoQ?.rows || []).map(r => ({ q: r.dimensionValues[0].value, imp: Number(r.metricValues[0].value), clicks: Number(r.metricValues[1].value), pos: Number(r.metricValues[2].value) })),
      pages: (xSeoP?.rows || []).map(r => ({ page: r.dimensionValues[0].value, imp: Number(r.metricValues[0].value), clicks: Number(r.metricValues[1].value), pos: Number(r.metricValues[2].value) })),
    },
  };

  const totalsRow = totals.rows?.[0]?.metricValues ?? [];
  const kpi = {
    views: Number(totalsRow[0]?.value || 0),
    sessions: Number(totalsRow[1]?.value || 0),
    users: Number(totalsRow[2]?.value || 0),
    bouncePct: Number(totalsRow[3]?.value || 0) * 100,
  };
  const pages = (topPages.rows || []).map(r => ({
    title: r.dimensionValues[0].value,
    views: Number(r.metricValues[0].value),
    users: Number(r.metricValues[1].value),
    bounce: Number(r.metricValues[2].value) * 100,
  }));
  const zh = pages.filter(p => /[一-鿿]/.test(p.title));
  const en = pages.filter(p => !/[一-鿿]/.test(p.title));
  const zhViews = zh.reduce((s, p) => s + p.views, 0);
  const enViews = en.reduce((s, p) => s + p.views, 0);
  const zhPct = zhViews + enViews > 0 ? (zhViews / (zhViews + enViews)) * 100 : 0;

  const SELF_RULES = [
    { match: /vercel\.com/i, self: 1.0, note: '(preview / deploy links — always self)', label: 'CERTAIN', conf: 'high' },
    { match: /admin\.travelpayouts/i, self: 1.0, note: '(your affiliate admin panel)', label: 'CERTAIN', conf: 'high' },
    { match: /^\(direct\)|direct/i, self: 0.7, note: '(month-1 direct is mostly you + Claude testing)', label: 'LIKELY', conf: 'mid' },
    { match: /facebook/i, self: 0.5, note: '(if you shared to your own timeline / friends)', label: 'GUESS', conf: 'low' },
    { match: /google/i, self: 0.05, note: '(real searchers — you rarely click your own site from Google)', label: 'CLEAN', conf: 'high' },
    { match: /tiktok/i, self: 0.05, note: '(clicks from your videos = real viewers)', label: 'CLEAN', conf: 'high' },
    { match: /pinterest/i, self: 0.05, note: '(pin-clickers = real interest)', label: 'CLEAN', conf: 'high' },
  ];
  const classify = (src, med) => SELF_RULES.find(r => r.match.test(src) || r.match.test(`${src}/${med}`)) ||
    { self: 0.1, note: '(unclassified — treated as mostly real)', label: 'ASSUMED', conf: 'low' };

  const sourceRows = (sources.rows || []).map(r => {
    const src = r.dimensionValues[0].value || '(direct)';
    const med = r.dimensionValues[1].value || '(none)';
    const sess = Number(r.metricValues[0].value);
    const c = classify(src, med);
    return { src, med, sess, ...c, selfSess: Math.round(sess * c.self) };
  });
  const totalSelf = sourceRows.reduce((s, r) => s + r.selfSess, 0);
  const selfPct = kpi.sessions > 0 ? (totalSelf / kpi.sessions) * 100 : 0;
  const earned = kpi.sessions - totalSelf;

  const now = new Date();
  const start = new Date(now); start.setDate(now.getDate() - DAYS);
  const fmt = d => d.toISOString().slice(0, 10);

  // Call Gemini for AI insight — cached by data fingerprint (no API call if data unchanged)
  const insight = await generateInsight({
    kpi, pages, sourceRows, zhViews, enViews, zhPct, totalSelf, earned, audience, more, days: DAYS,
  }, { force: forceInsight });

  const html = buildHtml({
    kpi, pages, sourceRows, zhViews, enViews, zhPct,
    totalSelf, selfPct, earned, insight, audience, more,
    dateLabel: `${fmt(start)} → ${fmt(now)}`,
    generatedAt: now.toISOString().slice(0, 16).replace('T', ' '),
    days: DAYS,
  });
  fs.writeFileSync(OUTPUT, html, 'utf8');
  console.log(`✅ Refreshed: ${kpi.views} views · ${kpi.sessions} sessions · ~${totalSelf} self · ~${earned} earned`);
  return html;
}

// ==================== AI insight via Gemini ====================
import crypto from 'node:crypto';

// Hash the parts of the data that would meaningfully change the insight.
// Rounds numbers so trivial +1/+2 fluctuations don't invalidate the cache.
function fingerprintData(d) {
  const round = n => Math.round(n / 5) * 5; // bucket to nearest 5
  const payload = {
    v: round(d.kpi.views),
    s: round(d.kpi.sessions),
    b: Math.round(d.kpi.bouncePct),
    z: Math.round(d.zhPct),
    pages: d.pages.slice(0, 6).map(p => `${p.title}|${round(p.views)}`),
    sources: d.sourceRows.slice(0, 6).map(r => `${r.src}/${r.med}|${round(r.sess)}`),
    imp: Math.round((d.more?.seo?.impressions || 0) / 10) * 10,
    aff: (d.more?.events || []).find(e => e.name === 'affiliate_click')?.count || 0,
    geo: (d.audience?.countries || []).slice(0, 5).map(r => `${r.name}|${round(r.users)}`),
  };
  return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex').slice(0, 16);
}

async function generateInsight(d, { force = false } = {}) {
  if (!OPENAI_API_KEY && !GEMINI_API_KEY) return { text: null, error: 'no_key', cached: false };

  const fp = fingerprintData(d);
  // Try cache first (unless force=true)
  if (!force && fs.existsSync(INSIGHT_CACHE)) {
    try {
      const cache = JSON.parse(fs.readFileSync(INSIGHT_CACHE, 'utf8'));
      if (cache.fingerprint === fp && cache.text) {
        const ageMin = Math.round((Date.now() - cache.generatedAt) / 60000);
        console.log(`💾 Insight served from cache (${ageMin} min old, data unchanged) — no Gemini call`);
        return { text: cache.text, error: null, cached: true, ageMin, generatedAt: cache.generatedAt, model: cache.model };
      }
    } catch {}
  }

  const M = d.more || {};
  const evLine = (M.events || []).slice(0, 10).map(e => `${e.name} ${e.count} (${e.users} users)`).join(', ') || 'no data';
  const chLine = (M.channels || []).map(ch => `${ch.name} ${ch.sessions}`).join(', ') || 'no data';
  const wkLine = M.wk ? `active users ${M.wk.cur.users} vs ${M.wk.prev.users} the week before; sessions ${M.wk.cur.sessions} vs ${M.wk.prev.sessions}; page views ${M.wk.cur.views} vs ${M.wk.prev.views}` : 'no data';
  const engLine = M.eng ? `engagement rate ${(M.eng.rate * 100).toFixed(0)}%, avg engagement time ${Math.round(M.eng.avgTimeSec)}s per user, ${M.eng.pagesPerSession.toFixed(1)} pages per session` : 'no data';
  const seoLine = M.seo?.has
    ? `Google showed the site ${M.seo.impressions} times, ${M.seo.clicks} clicks (${M.seo.ctr.toFixed(1)}% CTR), average position ${M.seo.pos.toFixed(0)}. Top queries: ${(M.seo.queries || []).slice(0, 5).map(x => `"${x.q}" ${x.imp} imp @${x.pos.toFixed(0)}`).join('; ') || 'none'}. Top pages in search: ${(M.seo.pages || []).slice(0, 4).map(x => `${x.page} ${x.imp} imp @${x.pos.toFixed(0)}`).join('; ') || 'none'}.`
    : 'not available';
  const audLine = (label, rows, fallback = 'no data') => `- ${label}: ${rows && rows.length ? rows.slice(0, 6).map(r => `${r.name} ${r.users}`).join(', ') : fallback}`;
  const topPages = d.pages.slice(0, 6).map(p => `  · ${p.title}: ${p.views} views, ${p.bounce.toFixed(1)}% bounce`).join('\n');
  const topSources = d.sourceRows.slice(0, 6).map(r => `  · ${r.src} (${r.med}): ${r.sess} sessions`).join('\n');

  const prompt = `You are a data analyst reviewing weekly Google Analytics for driftcoconut.com — a travel guide site covering Southeast Asia (Bangkok, Chiang Mai, Bali, Phuket, Krabi, etc.), monetized via affiliate links (Booking.com hotels, Klook activities, CueLinks for MakeMyTrip/Goibibo, Airalo eSIM). English + Chinese guides.

CURRENT ${d.days}-DAY SNAPSHOT:
- Page views: ${d.kpi.views} (~${(d.kpi.views / d.days).toFixed(0)}/day)
- Sessions: ${d.kpi.sessions} (${d.earned} earned + ${d.totalSelf} self-traffic)
- Bounce rate: ${d.kpi.bouncePct.toFixed(1)}%
- Chinese content share: ${d.zhPct.toFixed(0)}% (${d.zhViews} of ${d.zhViews + d.enViews} views)

TOP PAGES:
${topPages}

TRAFFIC SOURCES:
${topSources}

LAST 7 DAYS vs PREVIOUS 7: ${wkLine}
ENGAGEMENT: ${engLine}
EVENTS (${d.days}d): ${evLine}
CHANNELS (sessions): ${chLine}
GOOGLE SEARCH (${d.days}d): ${seoLine}

AUDIENCE (${d.days}-day active users):
${audLine('Countries', d.audience?.countries)}
${audLine('Top cities', d.audience?.cities)}
${audLine('Devices', d.audience?.devices)}
${audLine('New vs returning', d.audience?.newRet)}
${audLine('Age', d.audience?.age, 'not available — Google Signals off')}
${audLine('Gender', d.audience?.gender, 'not available — Google Signals off')}
(Note: the operator lives in Thailand, so Thailand/Bangkok-area traffic includes some self-traffic.)

Write EXACTLY 3 paragraphs of plain prose (each 2-3 sentences, no bullets, no headings, no markdown). Reference specific numbers.

Paragraph 1 — THE SITUATION: What's working, what user behavior tells us. Compare bounce rates. Note which content pulls traffic.

Paragraph 2 — THE AUDIENCE: Who is actually visiting — countries, cities, device mix, new vs returning. Say what that implies for language (EN vs ZH), content topics, and which affiliate offers fit these visitors. Discount Thailand for self-traffic. If age/gender is unavailable, say so briefly.

Paragraph 3 — THE OPPORTUNITY: Use the Google Search, affiliate_click and scroll data where relevant. The single most actionable improvement or notable flaw the operator should tackle THIS WEEK. Be concrete (e.g. "translate X guide to Chinese", "add more internal links to Bangkok"), not generic ("post more"). If you spot a data quality issue (like inflated direct traffic), flag it.`;

  // Providers tried in order. OpenAI first (if key present), Gemini as fallback.
  const attempts = [];
  if (OPENAI_API_KEY) for (const m of ['gpt-5-nano', 'gpt-4.1-nano', 'gpt-4o-mini']) attempts.push({ provider: 'openai', model: m });
  if (GEMINI_API_KEY) for (const m of ['gemini-3.5-flash-lite', 'gemini-3.5-flash']) attempts.push({ provider: 'gemini', model: m }); // prepay fallback

  async function callProvider({ provider, model }) {
    if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
        // gpt-5 family = reasoning models: no custom temperature, and hidden reasoning
        // tokens count toward the cap, so use minimal effort + a roomy limit.
        body: JSON.stringify(
          model.startsWith('gpt-5')
            ? { model, messages: [{ role: 'user', content: prompt }], reasoning_effort: 'minimal', max_completion_tokens: 2500 }
            : { model, messages: [{ role: 'user', content: prompt }], temperature: 0.6, max_completion_tokens: 900 }
        ),
      });
      const raw = await res.text();
      let j = {}; try { j = JSON.parse(raw); } catch {}
      if (!res.ok) return { error: `${res.status}: ${(j?.error?.message || raw).slice(0, 200)}` };
      return { text: j?.choices?.[0]?.message?.content?.trim() };
    }
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.6, maxOutputTokens: 900 },
        }),
      }
    );
    const raw = await res.text();
    let j = {}; try { j = JSON.parse(raw); } catch {}
    if (!res.ok) return { error: `${res.status}: ${(j?.error?.message || raw).slice(0, 200)}` };
    return { text: j?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() };
  }

  let lastError = '';
  for (const a of attempts) {
    try {
      console.log(`🤖 Trying ${a.provider}: ${a.model}...`);
      const r = await callProvider(a);
      if (r.error) { console.log(`⚠️  ${a.model} failed (${r.error})`); lastError = r.error; continue; }
      if (!r.text) { lastError = 'empty_response'; continue; }
      const generatedAt = Date.now();
      fs.writeFileSync(INSIGHT_CACHE, JSON.stringify({ fingerprint: fp, text: r.text, generatedAt, model: a.model }, null, 2));
      console.log(`✅ AI insight generated via ${a.model} (${r.text.length} chars)`);
      return { text: r.text, error: null, cached: false, ageMin: 0, generatedAt, model: a.model };
    } catch (e) {
      console.log(`⚠️  ${a.model} error: ${e.message}`);
      lastError = e.message;
    }
  }
  console.log(`❌ All AI models failed. Last error: ${lastError}`);
  return { text: null, error: lastError || 'all_models_failed', cached: false };
}

// ==================== HTTP Server ====================
let currentHtml = fs.existsSync(OUTPUT) ? fs.readFileSync(OUTPUT, 'utf8') : null;
let refreshing = false;

// Initial fetch (blocks server start until first data is ready)
try {
  currentHtml = await fetchAndBuild();
} catch (e) {
  console.error(`\n⚠️  Initial fetch failed: ${e.message}\n`);
  if (!currentHtml) die('No cached HTML to serve. Fix the error above and rerun.');
  console.error('Serving cached HTML from previous run. Click Update Data to retry.\n');
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${SERVE_PORT}`);

  if (url.pathname === '/refresh' && (req.method === 'POST' || req.method === 'GET')) {
    if (refreshing) {
      res.writeHead(429, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Already refreshing, wait...' }));
      return;
    }
    refreshing = true;
    try {
      const forceInsight = url.searchParams.get('force_insight') === '1';
      currentHtml = await fetchAndBuild({ forceInsight });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, at: new Date().toISOString(), forceInsight }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: e.message }));
    } finally {
      refreshing = false;
    }
    return;
  }

  if (url.pathname === '/' || url.pathname === '/dashboard' || url.pathname === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(currentHtml || '<h1>No dashboard data yet.</h1>');
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(SERVE_PORT, () => {
  const url = `http://localhost:${SERVE_PORT}`;
  console.log(`\n🌐 Dashboard live at: ${url}`);
  console.log(`   Click the "Update Data" button in the page for a fresh pull.`);
  console.log(`   Close this terminal window to stop the server.\n`);
  openUrl(url);
});

// ==================== HTML Builder ====================
function esc(s) { return String(s).replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c])); }
function bounceColor(b) { return b < 40 ? '#16a34a' : b < 60 ? '#f59e0b' : '#dc2626'; }
function isZh(s) { return /[一-鿿]/.test(s); }

function fmtDur(sec) { sec = Math.round(sec || 0); const m = Math.floor(sec / 60), s = sec % 60; return m ? `${m}m ${String(s).padStart(2, '0')}s` : `${s}s`; }
function pctChange(cur, prev) { return prev ? ((cur - prev) / prev) * 100 : null; }
function eventLabel(name) {
  const L = {
    page_view: 'Pages opened', user_engagement: 'Time spent reading', scroll: 'Scrolled down the page',
    session_start: 'Visits started', click: 'Clicked a link leaving the site', first_visit: 'First-time visitors',
    form_start: 'Started filling a form', form_submit: 'Submitted a form', affiliate_click: 'Clicked a hotel/activity (money) link',
    file_download: 'Downloaded a file', video_start: 'Started a video',
  };
  return L[name] || name.replace(/_/g, ' ');
}
function barRows(items, color) {
  const max = Math.max(...items.map(i => i.value), 1);
  return items.length ? items.map(i => `<div class="aud-row"><div class="aud-name" title="${esc(i.label)}">${esc(i.label)}</div><div class="aud-bar"><div class="aud-fill" style="width:${((i.value / max) * 100).toFixed(0)}%;background:${color}"></div></div><div class="aud-val" style="min-width:34px">${i.value}</div><div class="aud-pct"></div></div>`).join('')
    : '<div class="aud-empty">No data yet</div>';
}

// Plain-English findings, computed from the data (free — no AI call).
function buildMessages(d) {
  const M = d.more || {}; const out = [];
  const add = (level, icon, title, text) => out.push({ level, icon, title, text });
  const ev = name => (M.events || []).find(e => e.name === name);
  const totalU = Math.max(d.kpi.users, 1);

  if (M.wk) {
    const { cur, prev } = M.wk; const ch = pctChange(cur.users, prev.users);
    if (ch === null) add('info', '📅', 'First week of data', `${cur.users} people visited in the last 7 days. There is no earlier week to compare with yet.`);
    else if (ch >= 10) add('good', '📈', 'Visitors are growing', `${cur.users} people visited in the last 7 days, up ${ch.toFixed(0)}% from ${prev.users} the week before.`);
    else if (ch <= -10) add('warn', '📉', 'Visitors dipped this week', `${cur.users} people visited in the last 7 days, down ${Math.abs(ch).toFixed(0)}% from ${prev.users} the week before. Post something new to bring them back.`);
    else add('info', '➖', 'Visitors are steady', `${cur.users} people visited in the last 7 days, about the same as the week before (${prev.users}).`);
  }

  if (M.eng) {
    const rate = M.eng.rate * 100;
    add(rate >= 60 ? 'good' : rate < 40 ? 'warn' : 'info', rate >= 60 ? '👍' : '🤔', rate >= 60 ? 'Readers stick around' : 'Many visits are very short',
      `${rate.toFixed(0)}% of visits were "engaged" (stayed 10+ seconds, saw 2+ pages, or clicked something). The average visitor spends ${fmtDur(M.eng.avgTimeSec)} on the site — your own testing makes this look better than it really is.`);
  }

  if (M.seo?.has) {
    const s = M.seo;
    if (!s.impressions) add('info', '🔎', 'Google has not shown your site yet', 'No search impressions were recorded. New sites often take weeks — keep publishing and make sure the sitemap is submitted in Search Console.');
    else add(s.clicks === 0 || s.ctr < 1 ? 'warn' : 'good', '🔎', 'Google is showing you, but few click',
      `Google showed driftcoconut in search results ${s.impressions} times in ${d.days} days, but only ${s.clicks} ${s.clicks === 1 ? 'person' : 'people'} clicked (${s.ctr.toFixed(1)}%). Your average position is ${s.pos.toFixed(0)} — about page ${Math.max(1, Math.ceil(s.pos / 10))} of Google. Most people never look past page 1 (positions 1–10).`);
    const topP = (s.pages || []).find(x => x.imp > 0 && x.page !== '/');
    const topQ = (s.queries || [])[0];
    if (topP && topP.pos > 10) add('info', '🎯', 'Your biggest Google opportunity',
      `${topP.page} appears in Google the most (${topP.imp} times) but ranks around #${topP.pos.toFixed(0)}.${topQ ? ` The most common search is "${topQ.q}" — use those exact words in the page title and first paragraph.` : ''} More detail on the page and links to it from your other guides can push it toward page 1.`);
  } else {
    add('info', '🔎', 'Google Search data not available', 'Link Search Console to this Analytics property (GA → Admin → Product links) to see how you rank in Google.');
  }

  const aff = ev('affiliate_click');
  if (aff) {
    const share = (aff.users / totalU) * 100;
    add(share >= 10 ? 'good' : 'warn', '💰', share >= 10 ? 'Visitors click your money links' : 'Few visitors click your money links',
      `${aff.count} affiliate link ${aff.count === 1 ? 'click' : 'clicks'} from ${aff.users} ${aff.users === 1 ? 'visitor' : 'visitors'} (${share.toFixed(0)}% of all visitors). These clicks are where income comes from.${share < 10 ? ' Try putting hotel and activity links higher on the page with clear buttons.' : ''}`);
  } else {
    add('bad', '💰', 'No affiliate clicks yet', 'Nobody has clicked a hotel or activity link. Check that the links are visible near the top of each guide.');
  }

  const sc = ev('scroll');
  if (sc) {
    const share = (sc.users / totalU) * 100;
    add(share >= 50 ? 'good' : 'warn', '📜', share >= 50 ? 'Most visitors read down the page' : 'Most visitors do not scroll',
      `${share.toFixed(0)}% of visitors scrolled down a page.${share < 50 ? ' Put the best photo, the top pick and your key links near the top so people see them before leaving.' : ''}`);
  }

  const fs = ev('form_start');
  if (fs && !ev('form_submit')) add('info', '📝', 'Some people start forms', `${fs.users} ${fs.users === 1 ? 'visitor' : 'visitors'} started filling in a form but no submissions were recorded. If it is a sign-up or search form, check that it works.`);

  const nonDirect = (M.channels || []).filter(ch => !/^(direct|unassigned)$/i.test(ch.name));
  const totalSess = (M.channels || []).reduce((a, ch) => a + ch.sessions, 0);
  const direct = (M.channels || []).find(ch => /^direct$/i.test(ch.name));
  if (nonDirect.length) {
    const top = nonDirect[0]; const dShare = direct && totalSess ? (direct.sessions / totalSess) * 100 : 0;
    add('info', '📣', `${top.name} brings the most real visitors`,
      `${top.sessions} visits came from ${top.name}.${dShare >= 40 ? ` About ${dShare.toFixed(0)}% of all visits are "Direct" — mostly you testing the site plus links opened from chat apps — so real traffic is smaller than the headline number.` : ''}`);
  }

  const nr = d.audience?.newRet || [];
  const ret = nr.find(r => /return/i.test(r.name)); const nu = nr.find(r => /^new/i.test(r.name));
  if (nr.length) {
    const tot = (ret?.users || 0) + (nu?.users || 0);
    if (tot && (ret?.users || 0) / tot < 0.15) add('warn', '🔁', 'Almost nobody comes back', `${ret?.users || 0} of ${tot} visitors returned. Give people a reason to return: a newsletter, social follows, and "next destination" links at the end of each guide.`);
  }

  const th = (d.audience?.countries || []).find(r => r.id === 'TH');
  if ((d.audience?.countries || []).length) {
    const outside = 100 - ((th?.users || 0) / totalU) * 100;
    add(outside >= 50 ? 'good' : 'info', '🌏', outside >= 50 ? 'Most visitors are travelers abroad' : 'Most visitors are still in Thailand',
      outside >= 50 ? `${outside.toFixed(0)}% of visitors are outside Thailand — the audience a Thailand travel guide wants.` : `Only ${outside.toFixed(0)}% of visitors are outside Thailand, and Thailand includes you. TikTok, Pinterest and Google are the best ways to reach overseas travelers.`);
  }

  const mob = (d.audience?.devices || []).find(r => /mobile/i.test(r.name));
  if (mob && mob.users / totalU > 0.5) add('info', '📱', 'Most visitors use phones', `${((mob.users / totalU) * 100).toFixed(0)}% of visitors are on mobile. Check every guide and hotel box on a phone first.`);

  return out;
}

function buildHtml(d) {
  const pagesRows = d.pages.slice(0, 10).map(p => `
      <tr>
        <td><span class="page-label">${esc(p.title)}</span><span class="page-tag ${isZh(p.title) ? 'lang-zh' : 'lang-en'}">${isZh(p.title) ? 'ZH' : 'EN'}</span></td>
        <td class="num"><strong>${p.views}</strong></td>
        <td class="num">${p.users}</td>
        <td class="num"><span class="bounce-bar"><span class="bounce-fill" style="width:${Math.min(p.bounce, 100)}%;background:${bounceColor(p.bounce)}"></span></span>${p.bounce.toFixed(1)}%</td>
      </tr>`).join('');

  const maxSess = Math.max(...d.sourceRows.map(r => r.sess), 1);
  const sourceRows = d.sourceRows.slice(0, 8).map(r => {
    const icon = /google/i.test(r.src) ? '🔍' : /tiktok/i.test(r.src) ? '🎵' : /pinterest/i.test(r.src) ? '📌' : /facebook/i.test(r.src) ? '📘' : /vercel/i.test(r.src) ? '▲' : /direct/i.test(r.src) ? '🔗' : /travelpayouts/i.test(r.src) ? '💼' : '🌐';
    const pct = d.kpi.sessions > 0 ? ((r.sess / d.kpi.sessions) * 100).toFixed(0) : 0;
    return `
        <div class="source-row">
          <div class="source-icon">${icon}</div>
          <div class="source-name">${esc(r.src)} <div class="sub">${esc(r.med)} · ${esc(r.note)}</div></div>
          <div class="source-bar"><div class="source-fill" style="width:${(r.sess / maxSess) * 100}%;background:${r.self > 0.5 ? '#dc2626' : r.self > 0.2 ? '#f59e0b' : '#16a34a'}"></div></div>
          <div class="source-value">${r.sess}</div>
          <div class="source-pct">${pct}%</div>
        </div>`;
  }).join('');

  const selfRows = d.sourceRows.slice(0, 10).map(r => `
      <div class="self-row">
        <div><strong style="color:#0f2540">${esc(r.src)}</strong> <span style="color:#94a3b8;font-size:11px">${esc(r.note)}</span></div>
        <div class="num">${r.sess}</div>
        <div class="num" style="color:${r.self > 0.5 ? '#dc2626' : r.self > 0.2 ? '#f59e0b' : '#15803d'};font-weight:600">~${Math.round(r.self * 100)}%</div>
        <div><span class="conf-tag conf-${r.conf}">${r.label}</span></div>
      </div>`).join('');

  // ---- Audience section ----
  const A = d.audience || { countries: [], cities: [], devices: [], newRet: [], age: [], gender: [] };
  const flag = id => /^[A-Z]{2}$/.test(id || '') ? String.fromCodePoint(...[...id].map(ch => 127397 + ch.charCodeAt(0))) : '🌍';
  const totalU = Math.max(d.kpi.users, 1);
  const barList = (rows, color, iconFn, emptyMsg = 'No data yet') => rows.length ? rows.slice(0, 8).map(r => {
    const w = (r.users / Math.max(...rows.map(x => x.users), 1)) * 100;
    const pct = Math.min(100, (r.users / totalU) * 100);
    return `<div class="aud-row"><div class="aud-name" title="${esc(r.name)}">${iconFn ? iconFn(r) + ' ' : ''}${esc(r.name)}</div><div class="aud-bar"><div class="aud-fill" style="width:${w.toFixed(0)}%;background:${color}"></div></div><div class="aud-val">${r.users}</div><div class="aud-pct">${pct.toFixed(0)}%</div></div>`;
  }).join('') : `<div class="aud-empty">${emptyMsg}</div>`;
  const devIcon = r => /mobile/i.test(r.name) ? '📱' : /desktop/i.test(r.name) ? '💻' : /tablet/i.test(r.name) ? '📲' : '🖥️';
  const nrIcon = r => /new/i.test(r.name) ? '✨' : /return/i.test(r.name) ? '🔁' : '•';
  const gIcon = r => /female/i.test(r.name) ? '♀️' : /male/i.test(r.name) ? '♂️' : '•';
  const topC = A.countries[0];
  const thai = A.countries.find(r => r.id === 'TH');
  const outsideTh = A.countries.length ? Math.max(0, 100 - ((thai?.users || 0) / totalU) * 100) : 0;
  const signalsNote = 'Needs Google Signals: GA → Admin → Data collection and modification → Data collection → turn on Google signals. Small audiences are often hidden for privacy.';
  // ---- Plain-English findings + trend + search + behavior ----
  const X = d.more || {};
  const msgs = buildMessages(d);
  const msgHtml = msgs.length ? `
<div class="section">
  <div class="section-title">💬 What This Means — In Plain English</div>
  <div class="section-desc">Automatic findings from your Google Analytics and Search Console data. No AI needed.</div>
  <div class="msg-grid">${msgs.map(m => `<div class="msg msg-${m.level}"><div class="t">${m.icon} ${esc(m.title)}</div><div class="b">${esc(m.text)}</div></div>`).join('')}</div>
</div>` : '';

  const dayLabel = s => { const dt = new Date(`${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}T00:00:00Z`); return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }); };
  const maxDay = Math.max(...(X.daily || []).map(x => x.users), 1);
  const sparkHtml = (X.daily || []).length
    ? `<div class="spark">${X.daily.map(x => `<div class="spark-bar" style="height:${Math.max(2, (x.users / maxDay) * 100).toFixed(0)}%" title="${dayLabel(x.date)}: ${x.users} visitors, ${x.sessions} visits"></div>`).join('')}</div><div class="spark-axis"><span>${dayLabel(X.daily[0].date)}</span><span>${dayLabel(X.daily[Math.floor(X.daily.length / 2)].date)}</span><span>${dayLabel(X.daily[X.daily.length - 1].date)}</span></div>`
    : '<div class="aud-empty">No daily data yet</div>';
  const wkCard = (label, cur, prev) => { const ch = pctChange(cur, prev); const cls = ch === null ? 'flat' : ch > 3 ? 'up' : ch < -3 ? 'down' : 'flat'; const arrow = ch === null ? '' : ch > 3 ? '▲' : ch < -3 ? '▼' : '►'; return `<div class="wk"><div class="l">${label}</div><div class="v">${cur}</div><div class="c ${cls}">${ch === null ? 'no earlier week' : `${arrow} ${Math.abs(ch).toFixed(0)}% vs ${prev} last week`}</div></div>`; };
  const trendHtml = `
<div class="section">
  <div class="section-title">📈 Growth — Is It Going Up?</div>
  <div class="section-desc">Visitors per day for the last ${d.days} days, and this week compared with the week before.</div>
  ${X.wk ? `<div class="wk-grid">${wkCard('Visitors (7 days)', X.wk.cur.users, X.wk.prev.users)}${wkCard('Visits (7 days)', X.wk.cur.sessions, X.wk.prev.sessions)}${wkCard('Pages opened (7 days)', X.wk.cur.views, X.wk.prev.views)}</div>` : ''}
  <div class="card">${sparkHtml}</div>
</div>`;

  const S = X.seo || { has: false, queries: [], pages: [] };
  const seoRows = (rows, key) => rows.length ? `<div class="seo-row h"><div>${key === 'q' ? 'Search words' : 'Page'}</div><div class="r">Shown</div><div class="r">Rank</div></div>` + rows.slice(0, 8).map(r => `<div class="seo-row"><div class="n" title="${esc(r[key])}">${esc(r[key])}</div><div class="r">${r.imp}</div><div class="r">#${r.pos.toFixed(0)}</div></div>`).join('') : '<div class="aud-empty">No data yet</div>';
  const seoHtml = `
<div class="section">
  <div class="section-title">🔎 Google Search — How You Show Up</div>
  <div class="section-desc">From Search Console. "Shown" = times Google displayed your site. "Rank" = position in results (1–10 is page 1).</div>
  ${S.has ? `<div class="aud-stats">
    <div class="aud-stat"><div class="l">Times shown</div><div class="v">${S.impressions}</div></div>
    <div class="aud-stat"><div class="l">Clicks to your site</div><div class="v">${S.clicks}</div></div>
    <div class="aud-stat"><div class="l">Click rate</div><div class="v">${S.ctr.toFixed(1)}%</div></div>
    <div class="aud-stat"><div class="l">Average rank</div><div class="v">${S.impressions ? '#' + S.pos.toFixed(0) : '—'}</div></div>
  </div>
  <div class="aud-grid">
    <div class="aud-card"><h4>What people searched</h4>${seoRows(S.queries, 'q')}</div>
    <div class="aud-card"><h4>Pages Google shows</h4>${seoRows(S.pages, 'page')}</div>
  </div>` : '<div class="aud-empty">Search Console data is not available for this property.</div>'}
</div>`;

  const evRows = (X.events || []).filter(e => !['session_start', 'first_visit'].includes(e.name)).slice(0, 8).map(e => ({ label: eventLabel(e.name), value: e.count }));
  const chRows = (X.channels || []).map(ch => ({ label: ch.name, value: ch.sessions }));
  const lpRows = (X.landing || []).map(l => ({ label: l.page, value: l.sessions }));
  const behaviorHtml = `
<div class="section">
  <div class="section-title">🎯 What Visitors Do</div>
  <div class="section-desc">Actions on your site, how people arrive, and which page they land on first.</div>
  ${X.eng ? `<div class="aud-stats">
    <div class="aud-stat"><div class="l">Engaged visits</div><div class="v">${(X.eng.rate * 100).toFixed(0)}%</div></div>
    <div class="aud-stat"><div class="l">Time per visitor</div><div class="v">${fmtDur(X.eng.avgTimeSec)}</div></div>
    <div class="aud-stat"><div class="l">Pages per visit</div><div class="v">${X.eng.pagesPerSession.toFixed(1)}</div></div>
    <div class="aud-stat"><div class="l">Engaged visits</div><div class="v">${X.eng.engagedSessions} of ${X.eng.sessions}</div></div>
  </div>` : ''}
  <div class="aud-grid">
    <div class="aud-card"><h4>Actions taken</h4>${barRows(evRows, '#0891b2')}</div>
    <div class="aud-card"><h4>How people arrive (visits)</h4>${barRows(chRows, '#8b5cf6')}</div>
    <div class="aud-card" style="grid-column: 1 / -1"><h4>Page people land on first (visits)</h4>${barRows(lpRows, '#16a34a')}</div>
  </div>
</div>`;

  const audienceHtml = `
<div class="section">
  <div class="section-title">🌏 Audience — Who Visits</div>
  <div class="section-desc">Active users over the last ${d.days} days, by country, city, device and loyalty.</div>
  <div class="aud-stats">
    <div class="aud-stat"><div class="l">Active users</div><div class="v">${d.kpi.users}</div></div>
    <div class="aud-stat"><div class="l">Countries</div><div class="v">${A.countries.length}</div></div>
    <div class="aud-stat"><div class="l">Top country</div><div class="v">${topC ? flag(topC.id) + ' ' + esc(topC.name) : '—'}</div></div>
    <div class="aud-stat"><div class="l">Outside Thailand</div><div class="v">${outsideTh.toFixed(0)}%</div></div>
  </div>
  <div class="aud-grid">
    <div class="aud-card"><h4>Countries</h4>${barList(A.countries, '#0891b2', r => flag(r.id))}</div>
    <div class="aud-card"><h4>Top cities</h4>${barList(A.cities, '#8b5cf6', () => '📍')}</div>
    <div class="aud-card"><h4>Device</h4>${barList(A.devices, '#16a34a', devIcon)}</div>
    <div class="aud-card"><h4>New vs returning</h4>${barList(A.newRet, '#f59e0b', nrIcon)}</div>
    <div class="aud-card"><h4>Age</h4>${barList(A.age, '#ec4899', null, esc(signalsNote))}</div>
    <div class="aud-card"><h4>Gender</h4>${barList(A.gender, '#0ea5e9', gIcon, esc(signalsNote))}</div>
  </div>
</div>
`;

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>driftcoconut Analytics — ${d.dateLabel}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; color: #1a2332; line-height: 1.5; margin: 0; padding: 0; background: #f8fafc; min-height: 100vh; }
  .container { max-width: 1200px; margin: 0 auto; padding: 0; background: #ffffff; min-height: 100vh; box-shadow: 0 0 40px rgba(0,0,0,0.04); }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }
  .header { padding: 24px 32px; border-bottom: 1px solid #e5e8ee; margin-bottom: 24px; background: linear-gradient(135deg, #ecfeff 0%, #fef3c7 100%); }
  .header-row { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
  .header h1 { margin: 0 0 6px 0; font-size: 22px; font-weight: 700; color: #0f2540; }
  .header .sub { font-size: 13px; color: #64748b; }
  .header .gen { font-size: 11px; color: #94a3b8; margin-top: 4px; font-style: italic; }
  .update-btn { background: #0891b2; color: white; border: none; padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 1px 3px rgba(8,145,178,0.3); transition: all 0.15s; }
  .update-btn:hover:not(:disabled) { background: #0e7490; transform: translateY(-1px); }
  .update-btn:disabled { background: #94a3b8; cursor: wait; }
  .update-btn .spin { animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .toast { position: fixed; top: 20px; right: 20px; padding: 12px 20px; border-radius: 8px; color: white; font-weight: 600; font-size: 13px; z-index: 100; opacity: 0; transform: translateX(20px); transition: all 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.15); max-width: 400px; }
  .toast.show { opacity: 1; transform: translateX(0); }
  .toast-success { background: #16a34a; }
  .toast-error { background: #dc2626; }
  .grid { display: grid; gap: 12px; padding: 0 32px; }
  .kpi-row { grid-template-columns: repeat(4, 1fr); margin-bottom: 24px; }
  .kpi { background: #ffffff; border: 1px solid #e5e8ee; border-radius: 10px; padding: 16px 18px; }
  .kpi .label { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
  .kpi .value { font-size: 28px; font-weight: 700; color: #0f2540; line-height: 1.1; margin-bottom: 4px; }
  .kpi .desc { font-size: 11px; color: #94a3b8; line-height: 1.35; }
  .kpi .tag { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin-left: 6px; vertical-align: middle; }
  .tag-good { background: #dcfce7; color: #15803d; } .tag-warn { background: #fef3c7; color: #92400e; } .tag-info { background: #dbeafe; color: #1e40af; }
  .section { padding: 0 32px; margin-bottom: 28px; }
  .section-title { font-size: 13px; font-weight: 700; color: #0f2540; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
  .section-desc { font-size: 12px; color: #94a3b8; margin-bottom: 12px; font-style: italic; }
  table { width: 100%; border-collapse: collapse; background: #ffffff; border: 1px solid #e5e8ee; border-radius: 10px; overflow: hidden; font-size: 13px; }
  th { text-align: left; padding: 12px 14px; background: #f8fafc; font-weight: 600; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e8ee; }
  th.num, td.num { text-align: right; }
  td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; color: #334155; }
  tr:last-child td { border-bottom: none; }
  .page-label { font-weight: 500; color: #0f2540; }
  .page-tag { display: inline-block; font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 3px; margin-left: 6px; vertical-align: middle; }
  .lang-en { background: #e0f2fe; color: #0369a1; } .lang-zh { background: #fce7f3; color: #be185d; }
  .bounce-bar { display: inline-block; width: 60px; height: 6px; background: #e5e8ee; border-radius: 3px; overflow: hidden; vertical-align: middle; margin-right: 6px; }
  .bounce-fill { height: 100%; border-radius: 3px; }
  .source-row { display: flex; align-items: center; padding: 12px 14px; border-bottom: 1px solid #f1f5f9; gap: 12px; }
  .source-row:last-child { border-bottom: none; }
  .source-icon { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; background: #f1f5f9; }
  .source-name { flex: 1; font-size: 13px; color: #0f2540; font-weight: 500; }
  .source-name .sub { font-size: 11px; color: #94a3b8; font-weight: 400; font-style: italic; margin-top: 2px; }
  .source-bar { width: 180px; height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
  .source-fill { height: 100%; border-radius: 4px; }
  .source-value { font-weight: 700; color: #0f2540; font-size: 14px; min-width: 40px; text-align: right; }
  .source-pct { font-size: 11px; color: #94a3b8; min-width: 40px; text-align: right; }
  .card { background: #ffffff; border: 1px solid #e5e8ee; border-radius: 10px; padding: 16px 18px; }
  .two-col { display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px; }
  .self-row { display: grid; grid-template-columns: 2fr 80px 80px 90px; padding: 10px 14px; border-bottom: 1px solid #f1f5f9; align-items: center; font-size: 13px; gap: 8px; }
  .self-row:last-child { border-bottom: none; }
  .self-row.total { background: #fef3c7; font-weight: 700; color: #92400e; border-radius: 0 0 10px 10px; }
  .self-row .num { text-align: right; }
  .conf-tag { font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; text-align: center; }
  .conf-high { background: #dcfce7; color: #15803d; } .conf-mid { background: #fef3c7; color: #92400e; } .conf-low { background: #f1f5f9; color: #475569; }
  .ai-insight { background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border: 1px solid #ddd6fe; border-radius: 12px; padding: 20px 24px; }
  .ai-insight-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .ai-insight-badge { background: #7c3aed; color: white; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.5px; }
  .ai-insight-title { font-size: 13px; font-weight: 700; color: #4c1d95; text-transform: uppercase; letter-spacing: 0.5px; }
  .ai-insight-model { font-size: 11px; color: #7c3aed; font-style: italic; margin-left: auto; display: flex; align-items: center; gap: 8px; }
  .cache-tag { font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.3px; }
  .cache-tag.fresh { background: #dcfce7; color: #15803d; }
  .cache-tag.cached { background: #fef3c7; color: #92400e; }
  .regen-btn { background: transparent; border: 1px solid #7c3aed; color: #7c3aed; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; font-family: inherit; }
  .regen-btn:hover:not(:disabled) { background: #7c3aed; color: white; }
  .regen-btn:disabled { opacity: 0.5; cursor: wait; }
  .ai-insight-body { color: #1e1b4b; font-size: 14px; line-height: 1.6; }
  .ai-insight-body p { margin: 0 0 12px 0; }
  .ai-insight-body p:last-child { margin-bottom: 0; }
  .ai-insight-error { color: #92400e; font-style: italic; font-size: 13px; background: #fef3c7; padding: 10px 14px; border-radius: 6px; }
  .aud-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 12px; }
  .aud-stat { background: #f8fafc; border: 1px solid #e5e8ee; border-radius: 10px; padding: 12px 14px; }
  .aud-stat .l { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
  .aud-stat .v { font-size: 20px; font-weight: 700; color: #0f2540; margin-top: 2px; }
  .aud-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .aud-card { background: #fff; border: 1px solid #e5e8ee; border-radius: 10px; padding: 14px 16px; }
  .aud-card h4 { margin: 0 0 10px 0; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
  .aud-row { display: grid; grid-template-columns: minmax(90px, 1.3fr) 2fr 34px 38px; gap: 8px; align-items: center; padding: 4px 0; font-size: 13px; }
  .aud-name { color: #0f2540; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .aud-bar { height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
  .aud-fill { height: 100%; border-radius: 4px; }
  .aud-val { text-align: right; font-weight: 700; color: #0f2540; }
  .aud-pct { text-align: right; font-size: 11px; color: #94a3b8; }
  .aud-empty { font-size: 12px; color: #94a3b8; font-style: italic; }
  @media (max-width: 720px) { .aud-stats { grid-template-columns: repeat(2, 1fr); } .aud-grid { grid-template-columns: 1fr; } }
  .msg-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .msg { border: 1px solid #e5e8ee; border-left-width: 4px; border-radius: 10px; padding: 12px 14px; background: #fff; }
  .msg .t { font-size: 13px; font-weight: 700; color: #0f2540; margin-bottom: 3px; }
  .msg .b { font-size: 13px; color: #475569; line-height: 1.5; }
  .msg-good { border-left-color: #16a34a; background: #f0fdf4; } .msg-warn { border-left-color: #f59e0b; background: #fffbeb; }
  .msg-bad { border-left-color: #dc2626; background: #fef2f2; } .msg-info { border-left-color: #0891b2; background: #f0f9ff; }
  .wk-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 12px; }
  .wk { background: #f8fafc; border: 1px solid #e5e8ee; border-radius: 10px; padding: 10px 12px; }
  .wk .l { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
  .wk .v { font-size: 20px; font-weight: 700; color: #0f2540; }
  .wk .c { font-size: 11px; font-weight: 600; } .up { color: #15803d; } .down { color: #b91c1c; } .flat { color: #64748b; }
  .spark { display: flex; align-items: flex-end; gap: 3px; height: 90px; }
  .spark-bar { flex: 1; background: #0891b2; border-radius: 3px 3px 0 0; min-height: 2px; opacity: 0.85; }
  .spark-bar:hover { opacity: 1; background: #0e7490; }
  .spark-axis { display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; margin-top: 4px; }
  .seo-row { display: grid; grid-template-columns: 1fr 58px 50px; gap: 8px; padding: 5px 0; font-size: 12.5px; border-bottom: 1px solid #f1f5f9; align-items: center; }
  .seo-row.h { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.4px; }
  .seo-row .n { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #0f2540; font-weight: 500; }
  .seo-row .r { text-align: right; color: #334155; }
  @media (max-width: 720px) { .msg-grid, .wk-grid { grid-template-columns: 1fr; } }
  .quick-links { padding: 16px 32px; background: #f8fafc; border-top: 1px solid #e5e8ee; display: flex; gap: 12px; flex-wrap: wrap; font-size: 13px; }
  .quick-links a { color: #0891b2; text-decoration: none; padding: 6px 12px; background: white; border: 1px solid #e5e8ee; border-radius: 6px; font-weight: 500; }
  .quick-links a:hover { background: #e0f2fe; border-color: #0891b2; }
  @media (max-width: 720px) { .kpi-row { grid-template-columns: repeat(2, 1fr); } .two-col { grid-template-columns: 1fr; } .source-bar { display: none; } .grid, .section, .header, .quick-links { padding-left: 16px; padding-right: 16px; } }
</style>
</head>
<body>
<div class="container">
<h2 class="sr-only">driftcoconut GA dashboard for ${d.dateLabel}</h2>

<div class="header">
  <div class="header-row">
    <div>
      <h1>driftcoconut Analytics — ${d.dateLabel}</h1>
      <div class="sub">Live data from Google Analytics · ${d.pages.length} top pages, ${d.kpi.sessions} sessions across ${d.sourceRows.length} sources</div>
      <div class="gen">Generated: ${d.generatedAt} UTC · Click Update Data for instant fresh pull</div>
    </div>
    <button class="update-btn" id="updateBtn" onclick="doRefresh()">
      <svg id="refreshIcon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/><path d="M21 3v6h-6"/></svg>
      <span id="updateBtnText">Update Data</span>
    </button>
  </div>
</div>

<div id="toast" class="toast"></div>

<div class="grid kpi-row">
  <div class="kpi">
    <div class="label">Total Page Views</div>
    <div class="value">${d.kpi.views} <span class="tag tag-info">${d.days}d</span></div>
    <div class="desc">(Every time someone opened a page. ~${Math.round(d.kpi.views / d.days)} views/day.)</div>
  </div>
  <div class="kpi">
    <div class="label">Sessions</div>
    <div class="value">${d.kpi.sessions}</div>
    <div class="desc">(A single visit. ~${(d.kpi.sessions / d.days).toFixed(1)}/day.)</div>
  </div>
  <div class="kpi">
    <div class="label">Avg Bounce Rate</div>
    <div class="value">${d.kpi.bouncePct.toFixed(1)}% <span class="tag ${d.kpi.bouncePct < 40 ? 'tag-good' : 'tag-warn'}">${d.kpi.bouncePct < 40 ? 'GREAT' : d.kpi.bouncePct < 60 ? 'OK' : 'HIGH'}</span></div>
    <div class="desc">(% who leave after one page. Under 40% = engaged.)</div>
  </div>
  <div class="kpi">
    <div class="label">Chinese Traffic</div>
    <div class="value">${d.zhPct.toFixed(0)}% <span class="tag ${d.zhPct > 15 ? 'tag-good' : 'tag-info'}">${d.zhPct > 15 ? 'STRONG' : 'GROWING'}</span></div>
    <div class="desc">(Share of views on ZH pages.)</div>
  </div>
</div>

<div class="section">
  <div class="ai-insight">
    <div class="ai-insight-header">
      <span class="ai-insight-badge">AI</span>
      <span class="ai-insight-title">Weekly Insight Summary</span>
      <span class="ai-insight-model">
        ${d.insight?.text ? `${esc(d.insight.model || 'AI')} <span class="cache-tag ${d.insight.cached ? 'cached' : 'fresh'}">${d.insight.cached ? `cached · ${d.insight.ageMin}m old` : 'fresh · just written'}</span>` : 'AI insight'}
        <button class="regen-btn" id="regenBtn" onclick="regenInsight()" title="${d.insight?.text ? 'Force a new writeup even if data hasn\'t changed.' : 'Retry the AI insight.'}">${d.insight?.text ? '↻ Rewrite' : '🔄 Retry'}</button>
      </span>
    </div>
    ${d.insight?.text
      ? `<div class="ai-insight-body">${d.insight.text.split(/\n\n+/).map(p => `<p>${esc(p.trim())}</p>`).join('')}</div>`
      : d.insight?.error === 'no_key'
        ? `<div class="ai-insight-error">💡 To enable AI insights: add <code>OPENAI_API_KEY=your_key</code> (or <code>GEMINI_API_KEY</code>) to <code>.env.local</code>, then click Update Data.</div>`
        : `<div class="ai-insight-error">⚠️ AI insight failed (${d.insight?.error || 'unknown'}). Dashboard still works without this section.</div>`}
  </div>
</div>

${msgHtml}
${trendHtml}
${seoHtml}
${behaviorHtml}
${audienceHtml}
<div class="section">
  <div class="section-title">🕵️ Estimated Self-Generated Traffic</div>
  <div class="section-desc">Sessions likely from you (testing, previews, admin panels) — not real visitors.</div>
  <div class="card" style="padding:0">
    <div class="self-row" style="background:#f8fafc;font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">
      <div>Source</div><div class="num">Sessions</div><div class="num">Self %</div><div class="num">Confidence</div>
    </div>
    ${selfRows}
    <div class="self-row total">
      <div>Estimated total self-generated</div>
      <div class="num">~${d.totalSelf}</div>
      <div class="num">~${d.selfPct.toFixed(0)}% of all sessions</div>
      <div></div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">
    <div class="card" style="border-left:3px solid #dc2626">
      <div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Raw total (what GA shows)</div>
      <div style="font-size:24px;font-weight:700;color:#0f2540">${d.kpi.sessions} sessions</div>
      <div style="font-size:12px;color:#94a3b8;margin-top:4px">(inflated — includes you)</div>
    </div>
    <div class="card" style="border-left:3px solid #16a34a">
      <div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Estimated real earned traffic</div>
      <div style="font-size:24px;font-weight:700;color:#15803d">~${d.earned} sessions</div>
      <div style="font-size:12px;color:#94a3b8;margin-top:4px">(actual strangers who found you)</div>
    </div>
  </div>
</div>

<div class="section">
  <div class="section-title">Top Pages</div>
  <div class="section-desc">Which pages drew traffic. Lower bounce = readers stay on the page.</div>
  <table>
    <thead><tr><th>Page</th><th class="num">Views</th><th class="num">Users</th><th class="num">Bounce</th></tr></thead>
    <tbody>${pagesRows}</tbody>
  </table>
</div>

<div class="section">
  <div class="two-col">
    <div>
      <div class="section-title">Traffic Sources (Sessions)</div>
      <div class="section-desc">Red bar = mostly self-traffic; green = real visitors.</div>
      <div class="card" style="padding:0">${sourceRows}</div>
    </div>
    <div>
      <div class="section-title">Content Language Split</div>
      <div class="section-desc">Views by language across top pages.</div>
      <div class="card">
        <div style="display:flex;height:36px;border-radius:6px;overflow:hidden;margin-bottom:14px">
          <div style="width:${(100 - d.zhPct).toFixed(1)}%;background:#0891b2;color:white;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center">EN ${(100 - d.zhPct).toFixed(0)}%</div>
          <div style="width:${d.zhPct.toFixed(1)}%;background:#ec4899;color:white;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center">ZH ${d.zhPct.toFixed(0)}%</div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#64748b">
          <span><strong style="color:#0891b2">English</strong>: ${d.enViews} views</span>
          <span><strong style="color:#ec4899">Chinese</strong>: ${d.zhViews} views</span>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="quick-links">
  <a href="https://analytics.google.com/analytics/web/#/p${PROPERTY_ID}/reports/reportinghub" target="_blank">Open Google Analytics ↗</a>
  <a href="https://search.google.com/search-console" target="_blank">Search Console ↗</a>
  <a href="https://vercel.com/dashboard" target="_blank">Vercel Dashboard ↗</a>
  <a href="https://www.cuelinks.com/dashboard" target="_blank">CueLinks Dashboard ↗</a>
  <a href="https://driftcoconut.com" target="_blank">driftcoconut.com ↗</a>
</div>

<div style="padding:16px 32px;font-size:11px;color:#94a3b8;font-style:italic;text-align:center;border-top:1px solid #e5e8ee">
  Served by local dashboard server · Close the terminal window to stop.
</div>

</div>

<script>
async function doRefresh() {
  const btn = document.getElementById('updateBtn');
  const icon = document.getElementById('refreshIcon');
  const text = document.getElementById('updateBtnText');
  const toast = document.getElementById('toast');

  btn.disabled = true;
  icon.classList.add('spin');
  text.textContent = 'Fetching from GA...';

  try {
    const t0 = performance.now();
    const r = await fetch('/refresh', { method: 'POST' });
    const data = await r.json();
    if (!r.ok || !data.ok) throw new Error(data.error || 'Unknown error');
    const elapsed = ((performance.now() - t0) / 1000).toFixed(1);

    toast.textContent = '✓ Fresh data fetched in ' + elapsed + 's — reloading...';
    toast.className = 'toast toast-success show';
    setTimeout(() => window.location.reload(), 800);
  } catch (e) {
    toast.textContent = '✗ ' + e.message;
    toast.className = 'toast toast-error show';
    btn.disabled = false;
    icon.classList.remove('spin');
    text.textContent = 'Update Data';
    setTimeout(() => toast.classList.remove('show'), 5000);
  }
}

async function regenInsight() {
  const btn = document.getElementById('regenBtn');
  const toast = document.getElementById('toast');
  if (!confirm('Force a new AI writeup? Costs a fraction of a cent. Only useful if you want a different angle on the same data — otherwise the cached insight is identical.')) return;
  btn.disabled = true;
  btn.textContent = '⏳ Writing...';
  try {
    const r = await fetch('/refresh?force_insight=1', { method: 'POST' });
    const data = await r.json();
    if (!r.ok || !data.ok) throw new Error(data.error || 'Unknown error');
    toast.textContent = '✓ New insight written — reloading...';
    toast.className = 'toast toast-success show';
    setTimeout(() => window.location.reload(), 700);
  } catch (e) {
    toast.textContent = '✗ ' + e.message;
    toast.className = 'toast toast-error show';
    btn.disabled = false;
    btn.textContent = '↻ Rewrite';
    setTimeout(() => toast.classList.remove('show'), 5000);
  }
}
</script>
</body>
</html>`;
}
