import HeroHeader from "@brand/shared/components/hero-header";
import Wrapper from "@brand/shared/components/wrapper";
import Container from "@brand/shared/components/container";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CATALOGS } from "@/constants/catalogs";
import Image from "next/image";
import Link from "next/link";
import { ExternalLinkIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "@brand/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalozi | Stridon Group",
  description: "Preuzmite naše PDF kataloge za sve brendove koje zastupamo.",
};

export default async function KataloziPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Catalogs");

  return (
    <div>
      <HeroHeader
        title={t("title")}
        description={t("description")}
      />

      <Wrapper className="pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATALOGS.map((catalog, index) => (
            <Container key={catalog.id} animation="fadeUp" delay={0.05 * (index % 9)}>
              <div
                className="rounded-xl overflow-hidden flex flex-col justify-between min-h-[200px] p-5"
                style={{
                  background: `linear-gradient(to top, ${catalog.color}cc, ${catalog.color}55)`,
                }}
              >
                <div>
                  <div className="mb-3 h-10 relative w-28">
                    <Image
                      src={catalog.logoSrc}
                      alt={catalog.title}
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground leading-snug">
                    {catalog.title}
                  </h3>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <Button asChild size="sm" variant="secondary">
                    <a href={catalog.pdfUrl} target="_blank" rel="noopener noreferrer">
                      {t("viewPdf")}
                      <ExternalLinkIcon className="size-3.5" />
                    </a>
                  </Button>
                  <Link
                    href={`/brendovi/${catalog.brandSlug}`}
                    className="text-sm font-medium flex items-center gap-1 hover:underline"
                  >
                    {t("viewBrand")}
                    <ArrowRightIcon className="size-3.5" />
                  </Link>
                </div>
              </div>
            </Container>
          ))}
        </div>
      </Wrapper>
    </div>
  );
}
