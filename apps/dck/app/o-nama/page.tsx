import CompanyBenefits from "@brand/shared/components/company-benefits";
import CompanyStats from "@brand/shared/components/company-stats";
import CompanyValues from "@brand/shared/components/company-values";
import CTA from "@brand/shared/components/cta";
import HeroHeader from "@brand/shared/components/hero-header";
import { createPageMetadata } from "@brand/shared/lib/metadata";

export const metadata = createPageMetadata({
  title: "O nama",
  description:
    "Upoznaj DCK — međunarodni brend profesionalnih električnih alata. Zvanični distributer za Srbiju.",
  canonicalUrl: "/o-nama",
});

const AboutPage = () => {
  return (
    <div>
      <HeroHeader
        title="O nama"
        description="Upoznaj DCK — profesionalne električne alate koje distribuiramo kao jedini zvanični partner u Srbiji."
      />
      <CompanyStats />
      <CompanyValues />
      <CompanyBenefits />

      <CTA />
    </div>
  );
};

export default AboutPage;
