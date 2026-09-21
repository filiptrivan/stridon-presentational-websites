import { groupCatalogsByBrand } from "@/lib/catalog-groups";
import CatalogCardsGrid from "@brand/shared/components/catalog-cards-grid";
import HeroHeader from "@brand/shared/components/hero-header";
import Section from "@brand/shared/components/section";
import SectionHeader from "@brand/shared/components/section-header";
import StatusMessage from "@brand/shared/components/status-message";
import Wrapper from "@brand/shared/components/wrapper";
import { getAllCatalogs, getBrandCards } from "@brand/shared/lib/api";
import { createPageMetadata } from "@brand/shared/lib/metadata";
import { BookOpen } from "lucide-react";
import Image from "next/image";

export const metadata = createPageMetadata({
  title: "Katalozi",
  description:
    "PDF katalozi i cenovnici mašina, električnog i ručnog alata brendova koje Stridon Group zvanično uvozi i distribuira u Srbiji.",
  canonicalUrl: "/katalozi",
});

// Same cards dck and sg-tools get from the shared `catalogs-page`, but grouped by
// manufacturer, which those two have no use for: each of them sells one brand,
// so their whole page is one group. Stridon shows 22, and the groups are what
// `/brendovi/[slug]` deep-links into.
//
// The page reads the unscoped endpoint: `getCatalogs()` filters by BRAND_SLUG,
// and "stridon" is not a manufacturer in the CMS, so for this app it is empty.
const KataloziPage = async () => {
  // Both are cached reads the site already makes - `getBrandCards()` is the same
  // entry the homepage brand wall fills, so the logos here are free.
  const [catalogs, cards] = await Promise.all([
    getAllCatalogs(),
    getBrandCards(),
  ]);
  const groups = groupCatalogsByBrand(
    catalogs,
    new Map(cards.map((card) => [card.slug, card.imageUrl ?? null])),
  );

  return (
    <div>
      <HeroHeader
        title="Katalozi"
        description="Pregledaj širok izbor proizvoda i najbolje ponude mašina, električnog i ručnog alata za profesionalnu i kućnu upotrebu u našim akcijskim katalozima."
      />

      {groups.length === 0 ? (
        <Section>
          <Wrapper>
            <StatusMessage
              icon={BookOpen}
              title="Trenutno nema dostupnih kataloga."
              description="Proveri ponovo uskoro."
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
                            // Same call BrandLogo makes: PACMS serves some of
                            // these as SVG, which the optimizer rejects unless
                            // dangerouslyAllowSVG is on.
                            unoptimized
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
                      ? { label: "Idi na brend", href: group.href }
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
