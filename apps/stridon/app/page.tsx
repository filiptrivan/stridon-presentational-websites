import Brands from "@/components/brands";
import Hero from "@/components/hero";
import PartnerCta from "@/components/partner-cta";
import StatsBand from "@/components/stats-band";
import WhyStridon from "@/components/why-stridon";

// Preview-safe homepage: static sections only (no backend fetches yet).
// Katalozi / Servis / Klijenti sections come later.
const HomePage = () => {
  return (
    <div>
      <Hero />
      <Brands />
      <WhyStridon />
      <StatsBand />
      <PartnerCta />
    </div>
  );
};

export default HomePage;
