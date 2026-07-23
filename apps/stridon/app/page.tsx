import Hero from "@/components/hero";
import { CTA_TRUST_BADGES, FEATURES, STATS } from "@/constants/content";
import SharedCTA from "@brand/shared/components/cta";
import Features from "@brand/shared/components/features";
import Stats from "@brand/shared/components/stats";

// Preview-safe homepage: static sections only (no backend fetches yet).
// Product/brand data wiring and the remaining signature sections come later.
const HomePage = () => {
  return (
    <div>
      <Hero />
      <Features items={FEATURES} title="Zašto Stridon?" />
      <Stats stats={STATS} layout="four-up-no-three" />
      <SharedCTA trustBadges={CTA_TRUST_BADGES} />
    </div>
  );
};

export default HomePage;
