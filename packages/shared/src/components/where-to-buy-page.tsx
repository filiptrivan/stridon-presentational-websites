import { getBrandConfig } from "@brand/config";
import SharedCTA, { type TrustBadge } from "@brand/shared/components/cta";
import HeroHeader from "@brand/shared/components/hero-header";
import WhereToBuyContent from "@brand/shared/components/where-to-buy/where-to-buy-content";
import { createPageMetadata } from "@brand/shared/lib/metadata";
import type { Dealer } from "@brand/shared/types/dealers";

const brand = getBrandConfig();

export const metadata = createPageMetadata({
  title: "Gde kupiti",
  description: brand.whereToBuyDescription,
  canonicalUrl: "/gde-kupiti",
});

type WhereToBuyPageProps = {
  dealers: Dealer[];
  trustBadges: TrustBadge[];
};

const WhereToBuyPage = ({ dealers, trustBadges }: WhereToBuyPageProps) => {
  return (
    <div>
      <HeroHeader
        title="Gde kupiti"
        description={brand.whereToBuyDescription}
      />
      <WhereToBuyContent dealers={dealers} />
      <SharedCTA trustBadges={trustBadges} />
    </div>
  );
};

export default WhereToBuyPage;
