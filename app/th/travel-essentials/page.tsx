import TravelEssentialsPage from "@/components/TravelEssentialsPage";
import { travelEssentialsMetadata } from "@/lib/travelEssentials";

export const metadata = travelEssentialsMetadata("th");

export default function Page() {
  return <TravelEssentialsPage locale="th" />;
}
