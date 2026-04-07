import { ABOUT_MILESTONES, COMPANY_BENEFITS, STATS } from "@/constants/content";
import CompanyBenefits from "@brand/shared/components/company-benefits";
import CompanyStats from "@brand/shared/components/company-stats";
import CompanyValues from "@brand/shared/components/company-values";
import CTA from "@brand/shared/components/cta";
import HeroHeader from "@brand/shared/components/hero-header";
import { createPageMetadata } from "@brand/shared/lib/metadata";

export const metadata = createPageMetadata({
  title: "O nama",
  description:
    "Upoznaj DCK — brend kompanije Dongcheng, osnovane 1995. godine, prisutan u 100+ zemalja i zvanično dostupan u Srbiji.",
  canonicalUrl: "/o-nama",
});

const AboutPage = () => {
  return (
    <div>
      <HeroHeader
        title="O nama"
        description="Upoznaj DCK, brend kompanije Dongcheng iz 1995. godine, sa globalnim prisustvom i zvaničnom podrškom za tržište Srbije."
      />
      <CompanyStats stats={STATS} />
      <CompanyValues milestones={ABOUT_MILESTONES} title="Kako je nastao DCK" />
      <CompanyBenefits benefits={COMPANY_BENEFITS} />

      <CTA />
    </div>
  );
};

export default AboutPage;
