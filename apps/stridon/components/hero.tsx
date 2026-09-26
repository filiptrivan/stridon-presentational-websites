import { SHOP_URL } from "@/constants/links";
import { pathFor } from "@/lib/nav";
import type { Locale } from "@brand/i18n/config";
import Container from "@brand/shared/components/container";
import HeroHeader from "@brand/shared/components/hero-header";
import { Button } from "@brand/ui/button";
import { ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

// The hero dck uses (apps/dck/components/hero.tsx), with this site's copy and
// photo: the shared HeroHeader over the column grid, two actions, and the
// picture in dck's matted frame. Same classes on purpose, so the two sites
// read as one family; the fonts are this app's, through --font-heading.
//
// dck art-directs two files (16:9 desktop, 4:5 mobile). Here the picture is a
// wide spread of tools from the brands on the site, so it keeps its own ratio
// at every width: any crop would cut brands off either edge.
const Hero = async ({ locale }: { locale: Locale }) => {
  const t = await getTranslations({ locale, namespace: "Home.hero" });

  return (
    <HeroHeader
      title={t("title")}
      description={t("description")}
      showSvgGrid={true}
    >
      <Container delay={0.3}>
        <div className="flex gap-3 mt-6">
          <Button asChild>
            <a href={SHOP_URL} target="_blank" rel="noopener noreferrer">
              {t("shop")}
              <ExternalLink className="size-4" />
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link href={pathFor("/katalozi", locale)}>{t("catalog")}</Link>
          </Button>
        </div>
      </Container>

      <Container className="w-full z-30">
        <div className="relative mx-auto max-w-7xl rounded-2xl md:rounded-[32px] border border-neutral-200/50 bg-neutral-100 p-2 backdrop-blur-lg mt-10 md:mt-14">
          <div className="rounded-lg md:rounded-[24px] border border-neutral-200 bg-white">
            <Image
              src="/hero-brendovi.webp"
              alt={t("imageAlt")}
              width={2758}
              height={1504}
              // The LCP element on the homepage: `preload` (Next 16's name
              // for `priority`) puts a preload link for it in the head. The
              // docs say not to combine it with `fetchPriority`.
              preload
              // From 1280px up the frame stops growing: max-w-7xl less the
              // wrapper padding and the mat leaves 1180px of picture.
              sizes="(min-width: 1280px) 1180px, 100vw"
              className="h-auto w-full rounded-xl md:rounded-[26px]"
            />
          </div>
        </div>
      </Container>
    </HeroHeader>
  );
};

export default Hero;
