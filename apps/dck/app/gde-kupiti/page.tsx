import CTA from "@brand/shared/components/cta";
import HeroHeader from "@brand/shared/components/hero-header";
import WhereToBuyContent from "@brand/shared/components/where-to-buy/where-to-buy-content";
import { createPageMetadata } from "@brand/shared/lib/metadata";

export const metadata = createPageMetadata({
  title: "Gde kupiti",
  description:
    "Pronađi ovlašćene prodavnice i servise DCK alata širom Srbije.",
  canonicalUrl: "/gde-kupiti",
});

const WhereToBuyPage = () => {
  return (
    <div>
      <HeroHeader
        title="Gde kupiti"
        description="Pronađi ovlašćene prodavnice i servise DCK alata širom Srbije."
      />
      <WhereToBuyContent />
      <CTA />
    </div>
  );
};

export default WhereToBuyPage;
