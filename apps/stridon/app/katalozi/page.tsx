import BrandLogo from "@/components/brand-logo";
import PageHeader from "@/components/page-header";
import { getCatalogsByBrand } from "@/constants/catalogs";
import Container from "@brand/shared/components/container";
import Wrapper from "@brand/shared/components/wrapper";
import { createPageMetadata } from "@brand/shared/lib/metadata";
import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "Katalozi",
  description:
    "PDF katalozi i cenovnici mašina, električnog i ručnog alata brendova koje Stridon Group zvanično uvozi i distribuira u Srbiji.",
  canonicalUrl: "/katalozi",
});

const KataloziPage = () => {
  const groups = getCatalogsByBrand();

  return (
    <div>
      <PageHeader
        title="Katalozi"
        lede="Pregledaj širok izbor proizvoda i najbolje ponude mašina, električnog i ručnog alata za profesionalnu i kućnu upotrebu u našim akcijskim katalozima."
      />

      {groups.map((group) => (
        <section
          key={group.brand.slug}
          id={group.brand.slug}
          className="scroll-mt-20 border-b border-border"
        >
          <Wrapper className="py-12 lg:py-16">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
              <Container>
                <div className="lg:sticky lg:top-24">
                  <BrandLogo
                    brand={group.brand}
                    className="w-48 border border-border"
                    sizes="192px"
                  />
                  <h2 className="mt-5 text-2xl font-semibold tracking-tight">
                    {group.brand.name}
                  </h2>
                  <Link
                    href={`/brendovi/${group.brand.slug}`}
                    className="group mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary"
                  >
                    Idi na brend
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </Container>

              <Container delay={0.5}>
                <div className="border-b border-border">
                  {group.catalogs.map((catalog) => (
                    <a
                      key={catalog.slug}
                      href={catalog.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group grid gap-3 border-t border-border py-6 sm:grid-cols-[minmax(0,16rem)_1fr] sm:gap-8 lg:py-7"
                    >
                      <div className="flex items-start gap-0 self-start sm:gap-3">
                        {/* The marker only animates on hover, so on touch it
                            would just indent the title for nothing. */}
                        <span
                          aria-hidden
                          className="mt-2 hidden h-2.5 w-5 shrink-0 origin-left -skew-x-[14deg] scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100 sm:block"
                        />
                        <h3 className="font-heading text-lg font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1">
                          {catalog.name}
                        </h3>
                      </div>

                      <div>
                        <p className="text-[15px] leading-relaxed text-muted-foreground">
                          {catalog.description}
                        </p>
                        <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary">
                          Pogledaj PDF katalog
                          <ExternalLink className="size-4" />
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </Container>
            </div>
          </Wrapper>
        </section>
      ))}
    </div>
  );
};

export default KataloziPage;
