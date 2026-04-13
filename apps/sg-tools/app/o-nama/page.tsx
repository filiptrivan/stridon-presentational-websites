import AboutStory from "@brand/shared/components/about-story";
import CompanyBenefits from "@brand/shared/components/company-benefits";
import CompanyStats from "@brand/shared/components/company-stats";
import CompanyValues from "@brand/shared/components/company-values";
import CTA from "@/components/cta";
import HeroHeader from "@brand/shared/components/hero-header";
import { createPageMetadata } from "@brand/shared/lib/metadata";
import {
  ABOUT_MILESTONES,
  ABOUT_PARAGRAPHS,
  COMPANY_BENEFITS,
  STATS,
} from "@/constants/content";

export const metadata = createPageMetadata({
  title: "O nama",
  description:
    "Brend SG Tools nastao je iz porodične priče, dugogodišnjeg rada u alatima i svakodnevnog kontakta sa kupcima koji od alata traže pouzdanost, funkcionalnost i pristupačnu cenu.",
  canonicalUrl: "/o-nama",
});

const AboutPage = () => {
  return (
    <div>
      <HeroHeader
        title="Brend koji je nastao iz porodične priče i stvarnog iskustva"
        description="Iza brenda SG Tools stoje godine rada u prodaji, distribuciji i svakodnevnom kontaktu sa ljudima koji alat koriste da bi završili posao, zaradili i ispoštovali rokove. Posle dugogodišnjeg iskustva na tržištu, odlučili smo da znanje koje smo skupljali pretvorimo u sopstveni brend."
      />
      <CompanyStats stats={STATS} layout="three-up-from-sm" />
      <AboutStory paragraphs={ABOUT_PARAGRAPHS} />
      <CompanyValues milestones={ABOUT_MILESTONES} />
      <CompanyBenefits benefits={COMPANY_BENEFITS} />
      <CTA />
    </div>
  );
};

export default AboutPage;
