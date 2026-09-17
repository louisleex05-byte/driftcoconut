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

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            anonymize_ip: true,
            send_page_view: true,
          });
        `}
      </Script>
    </>
  );
}
