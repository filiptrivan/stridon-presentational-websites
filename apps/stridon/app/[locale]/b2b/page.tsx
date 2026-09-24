import B2bForm from "@/components/b2b-form";
import { B2B_PORTAL_URL } from "@/constants/links";
import { createLocalizedMetadata } from "@/lib/metadata";
import type { Locale } from "@brand/i18n/config";
import Container from "@brand/shared/components/container";
import HeroHeader from "@brand/shared/components/hero-header";
import Section from "@brand/shared/components/section";
import Wrapper from "@brand/shared/components/wrapper";
import { Button } from "@brand/ui/button";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "B2b.meta" });

  return createLocalizedMetadata({
    locale: locale as Locale,
    href: "/b2b",
    title: t("title"),
    description: t("description"),
  });
}

// Shared page header like the rest of the monorepo, portal login for existing
// partners, then the access request form. Both sections are centred to match
// /kontakt, which is the other "fill this in and we get back to you" page on
// the site - same shape, same axis.
const B2bPage = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "B2b" });

  return (
    <div>
      <HeroHeader title={t("hero.title")} description={t("hero.description")} />

      <Section className="py-12 lg:py-16">
        <Wrapper>
          <Container className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl">
              {t("existingB2BPartner.title")}
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              {t("existingB2BPartner.description")}
            </p>

            <Button asChild size="lg" className="mt-7">
              <a
                href={B2B_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("existingB2BPartner.action")}
                <ExternalLink className="size-4" />
              </a>
            </Button>
          </Container>
        </Wrapper>
      </Section>

      <Section className="py-14 lg:py-20">
        <Wrapper>
          <Container className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl">
              {t("request.title")}
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              {t("request.description")}
            </p>
          </Container>

          {/* The form is already `max-w-3xl w-full`, same as the shared contact
              page; it only needed a parent that centres it. */}
          <Container delay={0.3} className="mt-8 flex justify-center">
            <B2bForm locale={locale as Locale} />
          </Container>
        </Wrapper>
      </Section>
    </div>
  );
};

export default B2bPage;
