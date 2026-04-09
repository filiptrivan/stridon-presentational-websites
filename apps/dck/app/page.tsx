import Hero from "@/components/hero";
import CTA from "@/components/cta";
import { FEATURES, HOME_ABOUT_PARAGRAPH, STATS } from "@/constants/content";
import Categories from "@brand/shared/components/categories";
import CategoriesSkeleton from "@brand/shared/components/categories-skeleton";
import FeaturedProducts from "@brand/shared/components/featured-products";
import FeaturedProductsSkeleton from "@brand/shared/components/featured-products-skeleton";
import Features from "@brand/shared/components/features";
import HomeAbout from "@brand/shared/components/home-about";
import Stats from "@brand/shared/components/stats";
import { Suspense } from "react";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      <Suspense fallback={<CategoriesSkeleton />}>
        <Categories />
      </Suspense>
      <Features items={FEATURES} title="Zašto DCK?" />
      <HomeAbout title="O DCK" description={HOME_ABOUT_PARAGRAPH} />
      <Stats stats={STATS} layout="four-up-no-three" />
      <CTA />
    </div>
  );
};

export default HomePage;
