import { fillLegalLinks } from "@/lib/legal";
import { createLocalizedMetadata } from "@/lib/metadata";
import type { Locale } from "@brand/i18n/config";
import Container from "@brand/shared/components/container";
import HeroHeader from "@brand/shared/components/hero-header";
import Section from "@brand/shared/components/section";
import Wrapper from "@brand/shared/components/wrapper";
import { Prose } from "@brand/ui/prose";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal.terms.meta" });

  return createLocalizedMetadata({
    locale: locale as Locale,
    href: "/uslovi-koriscenja",
    title: t("title"),
    description: t("description"),
  });
}

const Page = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal.terms" });

  return (
    <div>
      <HeroHeader title={t("hero.title")} description={t("hero.description")} />
      <Section>
        <Wrapper>
          <Container>
            {/* One document per locale rather than forty keys - see lib/legal.ts. */}
            <Prose
              dangerouslySetInnerHTML={{
                __html: fillLegalLinks(t.raw("body") as string, locale as Locale),
              }}
            />
          </Container>
        </Wrapper>
      </Section>
    </div>
  );
};

export default Page;
