import Container from "@brand/shared/components/container";
import Wrapper from "@brand/shared/components/wrapper";
import { Button } from "@brand/ui/button";
import { CTA_TRUST_BADGES } from "@/constants/content";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// The single bold block on the page: ink band with the logo's red diagonal.
const PartnerCta = () => {
  return (
    <section className="relative overflow-hidden bg-foreground text-background">
      {/* Red diagonal beam, straight from the logo geometry. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 top-[-20%] hidden h-[140%] w-36 -skew-x-[14deg] bg-primary lg:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-36 top-[-20%] hidden h-[140%] w-10 -skew-x-[14deg] bg-background/10 lg:block"
      />

      <Wrapper className="relative py-20 lg:py-28">
        <div className="max-w-2xl">
          <Container>
            <p className="inline-flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.18em] text-background/60">
              <span
                aria-hidden
                className="inline-block h-3.5 w-6 -skew-x-[14deg] bg-primary"
              />
              Za dilere i firme
            </p>
          </Container>

          <Container delay={0.5}>
            <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-tight lg:text-6xl">
              Postani deo Stridon mreže.
            </h2>
          </Container>

          <Container delay={1}>
            <p className="mt-6 max-w-xl text-lg text-background/70">
              Veleprodajni uslovi, podrška i preko 30 brendova na jednom mestu.
              Više od 120 dilera širom Srbije već sarađuje sa nama.
            </p>
          </Container>

          <Container delay={1.5}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/kontakt">
                  Postani partner
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </Container>

          <Container delay={2}>
            <div className="mt-12 flex flex-wrap divide-x divide-background/20">
              {CTA_TRUST_BADGES.map((badge, i) => (
                <div
                  key={badge.text}
                  className={`flex items-center gap-2 pr-6 text-sm text-background/60 ${i > 0 ? "pl-6" : ""}`}
                >
                  <badge.icon className="size-4 shrink-0" strokeWidth={1.5} />
                  <span className="whitespace-nowrap">{badge.text}</span>
                </div>
              ))}
            </div>
          </Container>
        </div>
      </Wrapper>
    </section>
  );
};

export default PartnerCta;
