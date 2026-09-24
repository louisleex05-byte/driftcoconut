"use client";

import { useEffect } from "react";

/**
 * CueLinks auto-convert loader — EXACT match of the official snippet
 * from cuelinks.com > Installation > JavaScript for CID 323072.
 *
 * IMPORTANT: This uses CueLinks' expected globals (`cId` as a string,
 * `cuelinksv2.js` as the CDN source). Deviating from these breaks click
 * tracking silently — the script loads but no clicks register in Reports.
 *
 * Loads client-side after mount so it doesn't block Next.js hydration.
 * When NEXT_PUBLIC_CUELINKS_CID is absent (preview branches), no-ops.
 */
export default function CueLinksScript() {
  useEffect(() => {
    const cid = process.env.NEXT_PUBLIC_CUELINKS_CID;
    if (!cid) return;

    // Guard against double-injection on route changes
    if (document.querySelector('script[src*="cuelinksv2"]')) return;

    // Set the global cId that cuelinksv2.js reads on load
    (window as unknown as { cId: string }).cId = cid;

    // Inject the CDN script exactly as CueLinks' official snippet does
    const s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src =
      (document.location.protocol === "https:"
        ? "https://cdn0.cuelinks.com/js/"
        : "http://cdn0.cuelinks.com/js/") + "cuelinksv2.js";
    document.getElementsByTagName("body")[0].appendChild(s);
  }, []);

  return null;
}
