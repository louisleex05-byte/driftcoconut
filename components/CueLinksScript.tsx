import Script from "next/script";

/**
 * CueLinks auto-convert loader.
 *
 * Once this script is on the page, any raw link to MakeMyTrip, Goibibo, Yatra,
 * EaseMyTrip, and 500+ other CueLinks-registered merchants is transparently
 * rewritten to a tracked linksredirect.com URL at click time — so guide MDX
 * can just link to plain merchant URLs and still earn commissions.
 *
 * Absent NEXT_PUBLIC_CUELINKS_CID (e.g. preview branches without env vars),
 * the script silently no-ops. Loaded `afterInteractive` so it doesn't block
 * the LCP.
 */
export default function CueLinksScript() {
  const cid = process.env.NEXT_PUBLIC_CUELINKS_CID;
  if (!cid) return null;
  return (
    <>
      <Script id="cuelinks-config" strategy="afterInteractive">
        {`var clg = { key: '${cid}', gaCode: '' };`}
      </Script>
      <Script
        src="https://cdn0.cuelinks.com/js/cuelinks.min.js"
        strategy="afterInteractive"
      />
    </>
  );
}
