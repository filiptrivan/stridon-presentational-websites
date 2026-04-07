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
import {
  FEATURES,
  HOME_ABOUT_PARAGRAPH,
  STATS,
} from "@/constants/content";
import { TESTIMONIALS } from "@/constants";
import { Suspense } from "react";

const companies = [
  { src: "/companies/svgs/enterijerjankovic.svg", alt: "Enterijer Jankovic" },
  { src: "/companies/svgs/galens.svg", alt: "Galens" },
  { src: "/companies/svgs/termotim.svg", alt: "Termotim" },
  { src: "/companies/svgs/vitorog.svg", alt: "Vitorog" },
  { src: "/companies/svgs/nobili.svg", alt: "Nobili" },
  { src: "/companies/svgs/mbmrad.svg", alt: "MBM Rad" },
  { src: "/companies/svgs/hidroina.svg", alt: "Hidroina" },
  { src: "/companies/svgs/ingradnja.svg", alt: "Ingradnja" },
  { src: "/companies/svgs/silmaxlogo.svg", alt: "Silmax" },
  { src: "/companies/svgs/coligoars.svg", alt: "Coligoars" },
  { src: "/companies/svgs/kokreator.svg", alt: "Kokreator" },
  { src: "/companies/svgs/lokring.svg", alt: "Lokring" },
  { src: "/companies/svgs/mimiz.svg", alt: "Mimiz" },
];

const HomePage = () => {
  return (
    <div>
      <HeroDecorations />
      <Hero />
      <Companies companies={companies} />
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      <Suspense fallback={<CategoriesSkeleton />}>
        <Categories />
      </Suspense>
      <Features items={FEATURES} />
      <HomeAbout description={HOME_ABOUT_PARAGRAPH} />
      <Stats stats={STATS} />
      <Testimonials items={TESTIMONIALS} />
      <CTA />
    </div>
  );
};

export default HomePage;
