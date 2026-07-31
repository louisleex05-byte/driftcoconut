import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use — driftcoconut",
  description: "Terms for using driftcoconut.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto prose prose-slate">
      <h1 className="text-3xl font-bold">Terms of Use</h1>
      <p className="text-sm text-slate-500">Last updated: August 2026</p>

      <h2 className="text-xl font-semibold mt-8">1. About this service</h2>
      <p className="text-slate-600">
        driftcoconut is a hotel search and comparison service. We display hotel listings, photos,
        and prices supplied by third-party booking partners. We do not sell hotel accommodations
        directly.
      </p>

      <h2 className="text-xl font-semibold mt-8">2. Bookings</h2>
      <p className="text-slate-600">
        All bookings are made through, and fulfilled by, our partner sites (Agoda, Expedia,
        Booking.com, and others). Any contract for hotel accommodation is between you and the
        booking partner. Their terms, cancellation policies, and payment terms apply.
      </p>

      <h2 className="text-xl font-semibold mt-8">3. Pricing and availability</h2>
      <p className="text-slate-600">
        Prices and availability shown on driftcoconut are provided by our partners and are subject
        to change at any time without notice. Final pricing (including taxes, fees, and any
        discounts) is confirmed on the partner's booking page. We make reasonable efforts to
        ensure accuracy but are not liable for pricing errors or discrepancies.
      </p>

      <h2 className="text-xl font-semibold mt-8">4. Photos and content</h2>
      <p className="text-slate-600">
        Hotel photos, descriptions, and reviews displayed on driftcoconut are the property of the
        respective hotels or our booking partners and are used with permission under our affiliate
        agreements. You may not copy, redistribute, or reuse this content without explicit
        permission from the rights holder.
      </p>

      <h2 className="text-xl font-semibold mt-8">5. Affiliate disclosure</h2>
      <p className="text-slate-600">
        We earn a commission when you book through links on this site. This is disclosed clearly
        and does not affect the price you pay.
      </p>

      <h2 className="text-xl font-semibold mt-8">6. Acceptable use</h2>
      <p className="text-slate-600">
        You agree not to scrape, mass-download, reverse-engineer, or otherwise abuse the site or
        our partners' APIs. Automated access is prohibited without prior written consent.
      </p>

      <h2 className="text-xl font-semibold mt-8">7. Limitation of liability</h2>
      <p className="text-slate-600">
        driftcoconut provides search results "as is." We are not responsible for the quality,
        safety, availability, or accuracy of any hotel listed, nor for any losses arising from
        your booking with a partner site.
      </p>

      <h2 className="text-xl font-semibold mt-8">8. Governing law</h2>
      <p className="text-slate-600">
        These terms are governed by the laws of Thailand. Any disputes shall be resolved in the
        courts of Bangkok, Thailand.
      </p>

      <h2 className="text-xl font-semibold mt-8">9. Contact</h2>
      <p className="text-slate-600">
        For questions about these terms, email{" "}
        <a href="mailto:legal@driftcoconut.com" className="text-sea-700">legal@driftcoconut.com</a>.
      </p>
    </div>
  );
}
