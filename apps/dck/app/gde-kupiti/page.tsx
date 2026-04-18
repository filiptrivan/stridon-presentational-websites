import WhereToBuyPage from "@brand/shared/components/where-to-buy-page";
import { CTA_TRUST_BADGES } from "@/constants/content";
import { DEALERS } from "@/constants/dealers";

export { metadata } from "@brand/shared/components/where-to-buy-page";

export default function Page() {
  return <WhereToBuyPage dealers={DEALERS} trustBadges={CTA_TRUST_BADGES} />;
}
