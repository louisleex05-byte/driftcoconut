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
          var s = document.createElement('script');
          s.async = true;
          s.src = 'https://www.googletagmanager.com/gtag/js?id=${gaId}';
          document.head.appendChild(s);
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            anonymize_ip: true,
            send_page_view: true,
          });
          }
        `}
      </Script>
    </>
  );
}
