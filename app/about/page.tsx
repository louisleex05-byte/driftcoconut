import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — TravelSite",
  description: "Learn about TravelSite, your hotel search and booking companion.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto prose prose-slate">
      <h1 className="text-3xl font-bold">About TravelSite</h1>

      <p className="text-slate-600 mt-4">
        TravelSite helps travelers discover and compare hotels across Asia and beyond. We aggregate
        listings, photos, and real guest reviews from trusted booking partners so you can find the
        right room, in the right neighborhood, at the right price — without opening a dozen tabs.
      </p>

      <h2 className="text-xl font-semibold mt-8">What we do</h2>
      <p className="text-slate-600">
        We pull live availability and pricing from major hotel booking networks, then present it in
        a simple, unified search experience. When you find a stay you like, we send you directly to
        our partner's secure booking page to complete your reservation. We never charge you more
        than the partner's listed rate — our income comes from a small referral fee paid by the
        partner, at no cost to you.
      </p>

      <h2 className="text-xl font-semibold mt-8">Our partners</h2>
      <p className="text-slate-600">
        We work with reputable global hotel networks including Agoda, Expedia Group (Hotels.com,
        Expedia, Vrbo), Booking.com, and Tripadvisor. Every listing you see is verified inventory
        from one of these networks.
      </p>

      <h2 className="text-xl font-semibold mt-8">Contact</h2>
      <p className="text-slate-600">
        Questions, feedback, or partnership inquiries? Email{" "}
        <a href="mailto:hello@travelsite.example" className="text-brand">hello@travelsite.example</a>.
      </p>

      <p className="text-xs text-slate-400 mt-12">
        TravelSite is an independent hotel discovery service. Prices and availability are provided
        by our partners and are subject to change. All bookings and payment are handled by the
        respective booking partner.
      </p>
    </div>
  );
}
