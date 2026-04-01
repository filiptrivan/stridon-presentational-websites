import { getBrandConfig } from "@brand/config";
import {
  CreditCard,
  ExternalLink,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";
import Container from "./container";
import Section from "./section";
import { Button } from "@brand/ui/button";
import Wrapper from "./wrapper";
import { cn } from "../lib/utils";

const TRUST_BADGES = [
  { icon: Truck, text: "Besplatna dostava za 15.000+ RSD" },
  { icon: Zap, text: "Isporuka 1-5 dana" },
  { icon: ShieldCheck, text: "Garancija na mašine" },
  { icon: CreditCard, text: "Čekovi na 4 rate" },
];

const CTA = () => {
  const { shopUrl, ctaHeading, ctaGradientClasses } = getBrandConfig();

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
            {ctaHeading.split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <a
            href={shopUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg">
              Pogledaj ponudu
              <ExternalLink className="size-4" />
            </Button>
          </a>
          <div className="flex flex-wrap justify-center items-center gap-2 lg:gap-3">
            {TRUST_BADGES.map((badge, index) => (
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
