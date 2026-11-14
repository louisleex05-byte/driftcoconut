import TravelEssentialsPage from "@/components/TravelEssentialsPage";
import { travelEssentialsMetadata } from "@/lib/travelEssentials";

export const metadata = travelEssentialsMetadata("en");

export default function Page() {
  return <TravelEssentialsPage locale="en" />;
}
