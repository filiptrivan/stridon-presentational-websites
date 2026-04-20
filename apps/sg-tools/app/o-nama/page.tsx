import {
  ABOUT_MILESTONES,
  ABOUT_PARAGRAPHS,
  COMPANY_BENEFITS,
  CTA_TRUST_BADGES,
  STATS,
} from "@/constants/content";
import AboutStory from "@brand/shared/components/about-story";
import CompanyBenefits from "@brand/shared/components/company-benefits";
import CompanyStats from "@brand/shared/components/company-stats";
import CompanyValues from "@brand/shared/components/company-values";
import SharedCTA from "@brand/shared/components/cta";
import HeroHeader from "@brand/shared/components/hero-header";
import { createPageMetadata } from "@brand/shared/lib/metadata";

export const metadata = createPageMetadata({
  title: "O nama",
  description:
    "Brend SG TOOLS nastao je iz porodične priče, dugogodišnjeg rada u alatima i svakodnevnog kontakta sa kupcima koji od alata traže pouzdanost, funkcionalnost i pristupačnu cenu.",
  canonicalUrl: "/o-nama",
});

const AboutPage = () => {
  return (
    <div>
      <HeroHeader
        title="Brend koji je nastao iz porodične priče i stvarnog iskustva"
        description="Iza brenda SG TOOLS stoje godine rada u prodaji, distribuciji i svakodnevnom kontaktu sa ljudima koji alat koriste da bi završili posao, zaradili i ispoštovali rokove. Posle dugogodišnjeg iskustva na tržištu, odlučili smo da znanje koje smo skupljali pretvorimo u sopstveni brend."
      />
      <CompanyStats stats={STATS} layout="three-up-from-sm" />
      <AboutStory paragraphs={ABOUT_PARAGRAPHS} />
      <CompanyValues milestones={ABOUT_MILESTONES} />
      <CompanyBenefits benefits={COMPANY_BENEFITS} />
      <SharedCTA trustBadges={CTA_TRUST_BADGES} />
    </div>
  );
};

export default AboutPage;
