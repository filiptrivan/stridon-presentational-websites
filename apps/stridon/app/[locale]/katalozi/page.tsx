import { groupCatalogsByBrand } from "@/lib/catalog-groups";
import { createLocalizedMetadata } from "@/lib/metadata";
import { brandPath } from "@/lib/nav";
import type { Locale } from "@brand/i18n/config";
import CatalogCardsGrid from "@brand/shared/components/catalog-cards-grid";
import HeroHeader from "@brand/shared/components/hero-header";
import Section from "@brand/shared/components/section";
import SectionHeader from "@brand/shared/components/section-header";
import StatusMessage from "@brand/shared/components/status-message";
import Wrapper from "@brand/shared/components/wrapper";
import { getAllCatalogs, getBrandCards } from "@brand/shared/lib/api";
import { BookOpen } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Catalogs.meta" });

  return createLocalizedMetadata({
    locale: locale as Locale,
    href: "/katalozi",
    title: t("title"),
    description: t("description"),
  });
}

// Same cards dck and sg-tools get from the shared `catalogs-page`, but grouped by
// manufacturer, which those two have no use for: each of them sells one brand,
// so their whole page is one group. Stridon shows 22, and the groups are what
// `/brendovi/[slug]` deep-links into.
//
// The page reads the unscoped endpoint: `getCatalogs()` filters by BRAND_SLUG,
// and "stridon" is not a manufacturer in the CMS, so for this app it is empty.
const KataloziPage = async ({ params }: Props) => {
  const { locale } = await params;

  // Both are cached reads the site already makes - `getBrandCards()` is the same
  // entry the homepage brand wall fills, so the logos here are free.
  const [catalogs, cards, t] = await Promise.all([
    getAllCatalogs(),
    getBrandCards(),
    getTranslations({ locale, namespace: "Catalogs" }),
  ]);

  const groups = groupCatalogsByBrand(catalogs, {
    logoBySlug: new Map(cards.map((card) => [card.slug, card.imageUrl ?? null])),
    // Catalog titles come from PACMS and are translated there; these two are
    // ours, and the route has to be the one this locale is served at.
    untaggedName: t("untagged"),
    brandHref: (slug) => brandPath(slug, locale as Locale),
    sortLocale: locale,
  });

  return (
    <div>
      <HeroHeader title={t("hero.title")} description={t("hero.description")} />

      {groups.length === 0 ? (
        <Section>
          <Wrapper>
            <StatusMessage
              icon={BookOpen}
              title={t("empty.title")}
              description={t("empty.description")}
            />
          </Wrapper>
        </Section>
      ) : (
        groups.map((group) => (
          // The anchor sits on the wrapper rather than on Section, which draws
          // its own dashed divider at the top and takes no id.
          <div key={group.slug} id={group.slug} className="scroll-mt-20">
            {/* Tighter than Section's own py-16 lg:py-24: that spacing is sized
                for a handful of full sections on a page, and twenty of them
                turned a 3,000px page into a 12,500px one. */}
            <Section className="py-10 lg:py-12">
              <Wrapper>
                <SectionHeader
                  title={
                    <span className="flex items-center gap-3">
                      {group.imageUrl ? (
                        <span className="relative h-8 w-16 shrink-0">
                          <Image
                            src={group.imageUrl}
                            alt=""
                            fill
                            sizes="64px"
                            // Same rule BrandLogo applies: the optimizer
                            // rejects SVG unless dangerouslyAllowSVG is on, and
                            // a few PACMS logos are SVG. Only those bypass it -
                            // unconditionally it sent 19 raw CMS logos, 173 kB,
                            // into a 64x32 box, and exactly one of them was
                            // actually an SVG.
                            unoptimized={group.imageUrl
                              .toLowerCase()
                              .endsWith(".svg")}
                            className="object-contain object-left"
                          />
                        </span>
                      ) : null}
                      {group.name}
                    </span>
                  }
                  size="sm"
                  align="left"
                  className="mb-6"
                  // Only for a brand we actually list; the CMS carries catalogs
                  // for manufacturers stridon.rs does not show.
                  action={
                    group.href
                      ? { label: t("goToBrand"), href: group.href }
                      : undefined
                  }
                />
                <CatalogCardsGrid catalogs={group.catalogs} />
              </Wrapper>
            </Section>
          </div>
        ))
      )}
    </div>
  );
};

export default KataloziPage;
