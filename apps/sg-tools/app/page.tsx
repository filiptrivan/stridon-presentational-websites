import Categories from "@brand/shared/components/categories";
import CategoriesSkeleton from "@brand/shared/components/categories-skeleton";
import Companies from "@brand/shared/components/companies";
import CTA from "@brand/shared/components/cta";
import FeaturedProducts from "@brand/shared/components/featured-products";
import FeaturedProductsSkeleton from "@brand/shared/components/featured-products-skeleton";
import Features from "@brand/shared/components/features";
import Hero from "@/components/hero";
import HeroDecorations from "@/components/hero-decorations";
import HomeAbout from "@brand/shared/components/home-about";
import Stats from "@brand/shared/components/stats";
import Testimonials from "@brand/shared/components/testimonials";
import { STATS } from "@/constants/content";
import { Suspense } from "react";

const HomePage = () => {
  return (
    <div>
      <HeroDecorations />
      <Hero />
      <Companies />
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      <Suspense fallback={<CategoriesSkeleton />}>
        <Categories />
      </Suspense>
      <Features />
      <HomeAbout />
      <Stats stats={STATS} />
      <Testimonials />
      <CTA />
    </div>
  );
};

export default HomePage;
