import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — TravelSite",
  description: "How TravelSite handles your data.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto prose prose-slate">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="text-sm text-slate-500">Last updated: August 2026</p>

      <h2 className="text-xl font-semibold mt-8">What we collect</h2>
      <p className="text-slate-600">
        When you use TravelSite, we collect only the information necessary to help you search for
        hotels — your search parameters (destination, dates, number of guests). We do not require
        you to create an account, and we do not collect personal information such as your name,
        email, phone number, or payment details on this site.
      </p>

      <h2 className="text-xl font-semibold mt-8">Cookies and analytics</h2>
      <p className="text-slate-600">
        We use minimal, functional cookies to remember your recent searches and preferences during
        your visit. We may use aggregated, anonymized analytics (such as Vercel Analytics or Google
        Analytics) to understand overall site usage and improve the search experience.
      </p>

      <h2 className="text-xl font-semibold mt-8">Third-party bookings</h2>
      <p className="text-slate-600">
        When you click "Book Now" on a hotel, you are directed to a partner site (Agoda, Expedia,
        Booking.com, etc.) to complete your reservation. Your booking, payment, and any personal
        information you enter on the partner's site are governed by that partner's own privacy
        policy. TravelSite does not receive or store your payment information.
      </p>

      <h2 className="text-xl font-semibold mt-8">Affiliate disclosure</h2>
      <p className="text-slate-600">
        TravelSite participates in affiliate partnerships. When you book a hotel through our links,
        the partner may pay us a small commission at no additional cost to you. This does not
        influence which properties we display — inventory and pricing come directly from the
        partner's live data.
      </p>

      <h2 className="text-xl font-semibold mt-8">Your rights</h2>
      <p className="text-slate-600">
        You can clear cookies at any time through your browser. For any privacy-related questions,
        contact us at <a href="mailto:privacy@travelsite.example" className="text-brand">privacy@travelsite.example</a>.
      </p>

      <h2 className="text-xl font-semibold mt-8">Changes</h2>
      <p className="text-slate-600">
        We may update this policy from time to time. The "Last updated" date at the top reflects
        when it was last revised.
      </p>
    </div>
  );
}
