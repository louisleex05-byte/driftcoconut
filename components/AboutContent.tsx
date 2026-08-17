"use client";

import { PalmLeaf, Shell, Hibiscus, Boat, StrawHat } from "@/components/Decorations";
import TravelEssentials from "@/components/TravelEssentials";
import { useT } from "@/contexts/LanguageProvider";

export default function AboutContent() {
  const t = useT();
  return (
    <div className="max-w-3xl mx-auto prose prose-slate relative">
      <PalmLeaf className="hidden md:block absolute -top-4 -right-8 w-24 text-sea-300 opacity-55 rotate-12 pointer-events-none" />
      <StrawHat className="hidden md:block absolute top-8 -left-14 w-16 text-sea-300 opacity-55 -rotate-6 pointer-events-none" />
      <Hibiscus className="hidden md:block absolute top-1/2 -right-12 w-20 text-sea-200 opacity-60 rotate-45 pointer-events-none" />
      <Boat className="hidden md:block absolute bottom-1/3 -left-16 w-20 text-sea-300 opacity-55 pointer-events-none" />
      <Shell className="hidden sm:block absolute bottom-8 -right-6 w-14 text-sea-300 opacity-55 -rotate-12 pointer-events-none" />

      <h1 className="text-3xl font-bold">{t("about_h1")}</h1>

      <p className="text-slate-600 mt-4">{t("about_intro")}</p>

      <h2 className="text-xl font-semibold mt-8">{t("about_what_h2")}</h2>
      <p className="text-slate-600">{t("about_what_body")}</p>

      <h2 className="text-xl font-semibold mt-8">{t("about_partners_h2")}</h2>
      <p className="text-slate-600">{t("about_partners_body")}</p>

      <h2 className="text-xl font-semibold mt-8">{t("about_contact_h2")}</h2>
      <p className="text-slate-600">
        {t("about_contact_body_prefix")}
        <a href="mailto:hello@driftcoconut.com" className="text-sea-700">hello@driftcoconut.com</a>.
      </p>

      <p className="text-xs text-slate-400 mt-12">{t("about_disclaimer")}</p>

      <div className="not-prose mt-12 pt-8 border-t border-sea-100">
        <TravelEssentials
          headingKey="essentials_about_heading"
          subheadingKey="essentials_about_sub"
        />
      </div>
    </div>
  );
}
