import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";

export const metadata: Metadata = {
  title: "About — driftcoconut",
  description: "Learn about driftcoconut — your hotel search and booking companion for effortless getaways.",
};

export default function AboutPage() {
  return <AboutContent />;
}
