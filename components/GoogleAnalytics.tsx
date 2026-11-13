// Google Analytics 4 tracking component.
// Loads gtag.js with Next.js's <Script> component and initializes GA4.
//
// Enable by setting NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX in .env.local
// (and in Vercel Environment Variables for production).
//
// When the env var is missing, this component renders nothing so no tracking
// runs on preview branches or local dev — useful for keeping dev traffic out
// of production analytics.

import Script from "next/script";

export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!gaId) return null;

  // Only run on the real site. Vercel preview/deploy URLs (*.vercel.app) are skipped so
  // they never load the tag or show up as "additional domains" in GA tag diagnostics.
  return (
    <>
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          if (/(^|\\.)driftcoconut\\.com$/.test(location.hostname)) {
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){dataLayer.push(arguments);};
          // Owner device flag: open any page once with ?me=1 to mark this browser as internal
          // (?me=0 clears it). Hits are tagged traffic_type=internal, which a GA4 data filter excludes.
          var internal = false;
          try {
            var q = new URLSearchParams(location.search).get('me');
            if (q === '1') localStorage.setItem('dc_internal', '1');
            if (q === '0') localStorage.removeItem('dc_internal');
            internal = localStorage.getItem('dc_internal') === '1';
          } catch (e) {}
          var cfg = { anonymize_ip: true, send_page_view: true };
          if (internal) cfg.traffic_type = 'internal';
          // Open any page with ?debug=1 to make this visit appear in GA DebugView.
          try { if (new URLSearchParams(location.search).get('debug') === '1') cfg.debug_mode = true; } catch (e) {}
          window.gtag('js', new Date());
          window.gtag('config', '${gaId}', cfg);

          // Capture sponsored links rendered by both server and client components.
          function recordAffiliateClick(event) {
            if (event.type === 'auxclick' && event.button !== 1) return;
            var link = event.target instanceof Element
              ? event.target.closest('a[rel~="sponsored"][href]')
              : null;
            if (!link) return;

            var partner = link.dataset.affiliatePartner;
            if (!partner && link.hostname === 'www.tkqlhce.com') partner = 'booking';
            if (!partner && link.hostname === 's.shopee.co.th') partner = 'shopee';
            if (!partner) return;

            window.gtag('event', 'affiliate_click', {
              affiliate_partner: partner,
              affiliate_query: link.dataset.affiliateQuery || '',
              page_path: location.pathname,
              link_domain: link.hostname,
              placement: link.dataset.affiliatePlacement,
              trip_stage: link.dataset.tripStage,
              trip_tile: link.dataset.tripTile,
              product_id: link.dataset.productId
            });
          }
          document.addEventListener('click', recordAffiliateClick, true);
          document.addEventListener('auxclick', recordAffiliateClick, true);

          var s = document.createElement('script');
          s.async = true;
          s.src = 'https://www.googletagmanager.com/gtag/js?id=${gaId}';
          document.head.appendChild(s);
          }
        `}
      </Script>
    </>
  );
}
