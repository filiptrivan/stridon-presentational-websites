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
// dck art-directs two files (16:9 desktop, 4:5 mobile). The one photo here is a
// portrait of the Altina shop, so the frame sets those two ratios itself and
// the crop sits high enough to keep the shop sign and the window in view.
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
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl md:aspect-[2932/1664] md:rounded-[26px]">
              <Image
                src="/about/altina.webp"
                alt={t("imageAlt")}
                fill
                // The LCP element on the homepage: `preload` (Next 16's name
                // for `priority`) emits the preload link and fetchpriority.
                preload
                sizes="(min-width: 1280px) 1280px, 100vw"
                className="object-cover object-[50%_20%]"
              />
            </div>
          </div>
        </div>
      </Container>
    </HeroHeader>
  );
};

export default Hero;
