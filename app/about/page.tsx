import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";

export const metadata: Metadata = {
  title: "About",
  description: "driftcoconut is an independent Asia travel guide site: how the guides are made, how we earn money, and who we work with.",
};

export default function AboutPage() {
  return <AboutContent />;
}
