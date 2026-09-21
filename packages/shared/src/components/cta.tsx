import { getBrandConfig } from "@brand/config";
import { Button } from "@brand/ui/button";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "../lib/utils";
import Container from "./container";
import Section from "./section";
import Wrapper from "./wrapper";

export type TrustBadge = { icon: LucideIcon; text: string };

// The Serbian this component has always rendered. A translated site passes its
// own; the single-language sites pass nothing and are unchanged.
const DEFAULT_LABELS = {
  action: "Postani distributer",
};

export type CtaLabels = Partial<typeof DEFAULT_LABELS>;

interface CTAProps {
  trustBadges: TrustBadge[];
  labels?: CtaLabels;
  /** Where the button goes. A localized site has to pass the localized path. */
  actionHref?: string;
  /** Overrides `ctaHeading` from brand-config, which cannot vary by locale.
      A newline still breaks the line, same as the config value. */
  heading?: string;
}

const CTA = ({
  trustBadges,
  labels,
  actionHref = "/kontakt",
  heading,
}: CTAProps) => {
  const t = { ...DEFAULT_LABELS, ...labels };
  const { ctaHeading, ctaGradientClasses } = getBrandConfig();
  const text = heading ?? ctaHeading;

  return (
    <Section className="relative overflow-hidden">
      <Wrapper>
        <Container className="mx-auto flex flex-col items-center gap-6 md:gap-8">
          <h2
            className={cn(
              "text-4xl lg:text-7xl leading-tight text-transparent bg-clip-text bg-gradient-to-b font-semibold text-center",
              ctaGradientClasses,
            )}
          >
            {text.split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <Button size="lg" asChild>
            <Link href={actionHref}>
              {t.action}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <div className="flex flex-wrap justify-center items-center gap-2 lg:gap-3">
            {trustBadges.map((badge, index) => (
              <Container key={index} delay={0.2 * index}>
                <div className="flex items-center gap-2 px-2 py-2 rounded-lg text-muted-foreground">
                  <badge.icon className="size-3.5 shrink-0" strokeWidth={1.5} />
                  <span className="text-xs font-medium whitespace-nowrap">
                    {badge.text}
                  </span>
                </div>
              </Container>
            ))}
          </div>
        </Container>
      </Wrapper>
    </Section>
  );
};

export default CTA;
