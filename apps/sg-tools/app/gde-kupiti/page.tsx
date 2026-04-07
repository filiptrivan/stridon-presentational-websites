import CTA from "@brand/shared/components/cta";
import HeroHeader from "@brand/shared/components/hero-header";
import WhereToBuyContent from "@brand/shared/components/where-to-buy/where-to-buy-content";
import { createPageMetadata } from "@brand/shared/lib/metadata";
import { DEALERS } from "@/constants/dealers";

export const metadata = createPageMetadata({
  title: "Gde kupiti",
  description:
    "Pronađi ovlašćene prodavnice i servise SG Tools alata širom Srbije.",
  canonicalUrl: "/gde-kupiti",
});

const WhereToBuyPage = () => {
  return (
    <div>
      <HeroHeader
        title="Gde kupiti"
        description="Pronađi ovlašćene prodavnice i servise SG Tools alata širom Srbije."
      />
      <WhereToBuyContent dealers={DEALERS} />
      <CTA />
    </div>
  );
};

export default WhereToBuyPage;
