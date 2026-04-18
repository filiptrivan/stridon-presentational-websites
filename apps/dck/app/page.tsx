import Hero from "@/components/hero";
import {
  CTA_TRUST_BADGES,
  FEATURES,
  HOME_ABOUT_PARAGRAPH,
  STATS,
} from "@/constants/content";
import { TESTIMONIALS } from "@/constants";
import Categories from "@brand/shared/components/categories";
import CategoriesSkeleton from "@brand/shared/components/categories-skeleton";
import SharedCTA from "@brand/shared/components/cta";
import FeaturedProducts from "@brand/shared/components/featured-products";
import FeaturedProductsSkeleton from "@brand/shared/components/featured-products-skeleton";
import Features from "@brand/shared/components/features";
import HomeAbout from "@brand/shared/components/home-about";
import Stats from "@brand/shared/components/stats";
import Tags from "@brand/shared/components/tags";
import TagsSkeleton from "@brand/shared/components/tags-skeleton";
import Testimonials from "@brand/shared/components/testimonials";
import { Suspense } from "react";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      <Suspense fallback={<TagsSkeleton />}>
        <Tags />
      </Suspense>
      <Suspense fallback={<CategoriesSkeleton />}>
        <Categories />
      </Suspense>
      <Features items={FEATURES} title="Zašto DCK?" />
      <HomeAbout title="O DCK" description={HOME_ABOUT_PARAGRAPH} />
      <Stats stats={STATS} layout="four-up-no-three" />
      <Testimonials items={TESTIMONIALS} />
      <SharedCTA trustBadges={CTA_TRUST_BADGES} />
    </div>
  );
};

export default HomePage;
