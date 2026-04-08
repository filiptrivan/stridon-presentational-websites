import Hero from "@/components/hero";
import { FEATURES, STATS } from "@/constants/content";
import { TESTIMONIALS } from "@/constants";
import Categories from "@brand/shared/components/categories";
import CategoriesSkeleton from "@brand/shared/components/categories-skeleton";
import CTA from "@brand/shared/components/cta";
import FeaturedProducts from "@brand/shared/components/featured-products";
import FeaturedProductsSkeleton from "@brand/shared/components/featured-products-skeleton";
import Features from "@brand/shared/components/features";
import Stats from "@brand/shared/components/stats";
import Testimonials from "@brand/shared/components/testimonials";
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
      <Stats stats={STATS} layout="four-up-no-three" />
      <Testimonials items={TESTIMONIALS} />
      <CTA />
    </div>
  );
};

export default HomePage;
