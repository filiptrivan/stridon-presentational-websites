import Brands from "@/components/brands";
import Hero from "@/components/hero";
import OwnBrand from "@/components/own-brand";
import { OWN_BRANDS } from "@/constants/about";
import { CTA_TRUST_BADGES, FEATURES, STATS } from "@/constants/content";
import CompanyStats from "@brand/shared/components/company-stats";
import SharedCTA from "@brand/shared/components/cta";
import Features from "@brand/shared/components/features";

const [SG_TOOLS, DCK] = OWN_BRANDS;

// Preview-safe homepage: static sections only (no backend fetches yet).
// Order: what we carry -> numbers -> what is ours -> why us -> the ask.
const HomePage = () => {
  return (
    <div>
      <Hero />
      <Brands />
      <CompanyStats stats={STATS} layout="four-up-no-three" />
      <OwnBrand brand={SG_TOOLS} />
      <OwnBrand brand={DCK} />
      <Features items={FEATURES} title="Zašto Stridon?" />
      <SharedCTA trustBadges={CTA_TRUST_BADGES} />
    </div>
  );
};

export default HomePage;
