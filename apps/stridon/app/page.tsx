import Brands from "@/components/brands";
import Hero from "@/components/hero";
import OwnBrand from "@/components/own-brand";
import PartnerCta from "@/components/partner-cta";
import StatsBand from "@/components/stats-band";
import WhyStridon from "@/components/why-stridon";
import { OWN_BRANDS } from "@/constants/about";

const [SG_TOOLS, DCK] = OWN_BRANDS;

// Preview-safe homepage: static sections only (no backend fetches yet).
// Order: what we carry -> numbers -> what is ours -> why us -> the ask.
const HomePage = () => {
  return (
    <div>
      <Hero />
      <Brands />
      <StatsBand />
      <OwnBrand brand={SG_TOOLS} />
      <OwnBrand brand={DCK} />
      <WhyStridon />
      <PartnerCta />
    </div>
  );
};

export default HomePage;
