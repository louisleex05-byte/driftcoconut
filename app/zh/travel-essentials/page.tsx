import TravelEssentialsPage from "@/components/TravelEssentialsPage";
import { travelEssentialsMetadata } from "@/lib/travelEssentials";

export const metadata = travelEssentialsMetadata("zh");

export default function Page() {
  return <TravelEssentialsPage locale="zh" />;
}
