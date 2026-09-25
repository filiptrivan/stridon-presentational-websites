import type { SpotlightBrandDef } from "@/constants/about";
import type { Locale } from "@brand/i18n/config";
import Container from "@brand/shared/components/container";
import Section from "@brand/shared/components/section";
import Wrapper from "@brand/shared/components/wrapper";
import { Button } from "@brand/ui/button";
import { ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

interface BrandSpotlightProps {
  brand: SpotlightBrandDef;
  locale: Locale;
}

// The two brands the site gives a section of their own: SG TOOLS, the group's
// own brand, and DCK, which Stridon is the only verified supplier of in Serbia.
// One section per brand, both reading copy left / photo right.
//
// The heading and the blurb come from `BrandSpotlights.<key>` rather than from the
// page, so the homepage and /onama cannot drift apart - they render this same
// component and therefore the same copy.
const BrandSpotlight = async ({ brand, locale }: BrandSpotlightProps) => {
  const t = await getTranslations({
    locale,
    namespace: `BrandSpotlights.${brand.key}`,
  });
  const paragraphs = t.raw("paragraphs") as string[];

  return (
    <Section className="py-20 lg:py-28">
      <Wrapper>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Container>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                {t("heading")}
              </h2>

              {paragraphs.map((paragraph, index) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className={`max-w-lg text-muted-foreground ${
                    index === 0 ? "mt-5" : "mt-4"
                  }`}
                >
                  {paragraph}
                </p>
              ))}

              <div className="mt-8">
                <Button asChild size="lg" variant="outline">
                  <a
                    href={brand.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("linkLabel")}
                    <ExternalLink className="size-4" />
                  </a>
                </Button>
              </div>
            </div>
          </Container>

          <Container delay={0.5}>
            {/* The matted frame dck uses for its homepage hero image: a soft grey
                outer plate, a hairline inner box, and the photo rounded inside
                it. Tokens rather than dck's raw `neutral-*`, so it picks up this
                app's palette instead of hardcoding the sibling site's. */}
            <div className="rounded-2xl border border-border/50 bg-foreground/5 p-2 md:rounded-[32px]">
              <div className="overflow-hidden rounded-xl border border-border/60 bg-background md:rounded-[24px]">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={brand.image.src}
                    alt={t("imageAlt")}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </Container>
        </div>
      </Wrapper>
    </Section>
  );
};

export default BrandSpotlight;
