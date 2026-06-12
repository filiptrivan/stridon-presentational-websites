import HeroHeader from "@brand/shared/components/hero-header";
import Wrapper from "@brand/shared/components/wrapper";
import Container from "@brand/shared/components/container";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BRANDS } from "@/constants/brands";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Brands" });
  return {
    title: `${t("title")} | Stridon Group`,
    description: t("description"),
  };
}

export default async function BrendoviPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Brands");
  const loc = locale as "sr" | "en";

  return (
    <div>
      <HeroHeader
        title={t("title")}
        description={t("description")}
      />

      <Wrapper className="pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {BRANDS.map((brand, index) => (
            <Container key={brand.slug} animation="fadeUp" delay={0.04 * (index % 10)}>
              <Link
                href={`/brendovi/${brand.slug}`}
                className="group flex flex-col items-center gap-4 p-5 rounded-xl border border-border/60 bg-card hover:border-primary/25 hover:bg-muted/30 transition-all duration-200"
              >
                <div className="relative h-12 w-full">
                  <Image
                    src={brand.logoSrc}
                    alt={brand.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">{brand.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {brand.heroDescription[loc]}
                  </p>
                </div>
                <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                  {t("viewBrand")} <ArrowRightIcon className="size-3" />
                </span>
              </Link>
            </Container>
          ))}
        </div>
      </Wrapper>
    </div>
  );
}
