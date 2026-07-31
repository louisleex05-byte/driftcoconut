import type { Metadata } from "next";
import { PalmLeaf, Shell, Hibiscus, Boat, StrawHat } from "@/components/Decorations";

export const metadata: Metadata = {
  title: "About — driftcoconut",
  description: "Learn about driftcoconut — your hotel search and booking companion for effortless getaways.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto prose prose-slate relative">
      {/* Corner accents */}
      <PalmLeaf className="hidden md:block absolute -top-4 -right-8 w-24 text-sea-300 opacity-55 rotate-12 pointer-events-none" />
      <StrawHat className="hidden md:block absolute top-8 -left-14 w-16 text-sea-300 opacity-55 -rotate-6 pointer-events-none" />
      <Hibiscus className="hidden md:block absolute top-1/2 -right-12 w-20 text-sea-200 opacity-60 rotate-45 pointer-events-none" />
      <Boat className="hidden md:block absolute bottom-1/3 -left-16 w-20 text-sea-300 opacity-55 pointer-events-none" />
      <Shell className="hidden sm:block absolute bottom-8 -right-6 w-14 text-sea-300 opacity-55 -rotate-12 pointer-events-none" />

      <h1 className="text-3xl font-bold">About driftcoconut</h1>

      <p className="text-slate-600 mt-4">
        driftcoconut helps travelers discover and compare hotels across Asia and beyond. We aggregate
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
        <a href="mailto:hello@driftcoconut.com" className="text-sea-700">hello@driftcoconut.com</a>.
      </p>

      <p className="text-xs text-slate-400 mt-12">
        driftcoconut is an independent hotel discovery service. Prices and availability are provided
        by our partners and are subject to change. All bookings and payment are handled by the
        respective booking partner.
      </p>
    </div>
  );
}
