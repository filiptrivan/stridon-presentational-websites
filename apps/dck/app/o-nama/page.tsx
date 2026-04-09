import CTA from "@/components/cta";
import {
  ABOUT_GALLERY,
  ABOUT_MILESTONES,
  ABOUT_PARAGRAPHS,
  COMPANY_BENEFITS,
  STATS,
} from "@/constants/content";
import AboutStory from "@brand/shared/components/about-story";
import CompanyBenefits from "@brand/shared/components/company-benefits";
import CompanyStats from "@brand/shared/components/company-stats";
import CompanyValues from "@brand/shared/components/company-values";
import HeroHeader from "@brand/shared/components/hero-header";
import { createPageMetadata } from "@brand/shared/lib/metadata";

export const metadata = createPageMetadata({
  title: "O nama",
  description:
    "DCK je profesionalni brend kompanije Dongcheng sa sopstvenom proizvodnjom, brushless aku programom i 3 godine garancije - zvanično dostupan u Srbiji.",
  canonicalUrl: "/o-nama",
});

const AboutPage = () => {
  return (
    <div>
      <HeroHeader
        title="Vrhunski kvalitet bez preterane cene"
        description="DCK je profesionalni brend koji dokazuje da kvalitet alata ne mora da košta bogatstvo. Sa skoro tri decenije iskustva, sopstvenom proizvodnjom i distribucijom u preko 100 zemalja, DCK je stigao i u Srbiju - sa punom podrškom, garancijom i servisom."
      />
      <CompanyStats stats={STATS} layout="four-up-no-three" />
      <AboutStory title="Priča iza brenda" paragraphs={ABOUT_PARAGRAPHS} />
      <CompanyValues
        milestones={ABOUT_MILESTONES}
        title="Kako je nastao DCK"
        galleryImages={ABOUT_GALLERY}
      />
      <CompanyBenefits benefits={COMPANY_BENEFITS} />

      <CTA />
    </div>
  );
};

export default AboutPage;
