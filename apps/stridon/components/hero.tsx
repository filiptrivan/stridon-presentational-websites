import Container from "@brand/shared/components/container";
import Wrapper from "@brand/shared/components/wrapper";
import { Button } from "@brand/ui/button";
import { BRANDS } from "@/constants/content";
import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

const TRUST = [
  { value: "30+", label: "brendova" },
  { value: "120+", label: "dilera" },
  { value: "10.630+", label: "kupaca" },
];

const Hero = () => {
  return (
    <div className="relative overflow-hidden border-b border-border">
      {/* Background ornament: the logo's diagonal beam geometry, as hairlines. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-16 hidden h-[26rem] w-[34rem] -skew-x-[14deg] border border-border lg:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-40 top-40 hidden h-[26rem] w-24 -skew-x-[14deg] bg-muted lg:block"
      />

      <Wrapper className="relative py-20 sm:py-24 lg:py-28">
        <div className="max-w-4xl">
          <Container>
            <p className="inline-flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <span
                aria-hidden
                className="inline-block h-3.5 w-6 -skew-x-[14deg] bg-primary"
              />
              Zvanični uvoznik i distributer alata
            </p>
          </Container>

          <Container delay={0.5}>
            <h1 className="mt-8 text-[clamp(2.75rem,7.5vw,5.5rem)] font-semibold leading-[0.98] tracking-tight">
              <span className="relative inline-block px-3 sm:px-4">
                <span
                  aria-hidden
                  className="absolute inset-0 -skew-x-[10deg] bg-primary"
                />
                <span className="relative text-primary-foreground">
                  Najbolja
                </span>
              </span>{" "}
              prodavnica
              <br />
              alata u Srbiji.
            </h1>
          </Container>

          <Container delay={1}>
            <p className="mt-7 max-w-xl text-lg text-muted-foreground">
              Uvoz, veleprodaja i maloprodaja profesionalnog alata. Preko 30
              svetskih brendova, uz tehničku podršku, garanciju i brzu isporuku
              širom Srbije.
            </p>
          </Container>

          <Container delay={1.5}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <a
                  href="https://www.prodavnicaalata.rs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Online prodavnica
                  <ExternalLink className="size-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/kontakt">
                  Postani partner
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </Container>

          <Container delay={2}>
            <dl className="mt-14 flex flex-wrap divide-x divide-border">
              {TRUST.map((t, i) => (
                <div
                  key={t.label}
                  className={`flex items-baseline gap-2 pr-8 ${i > 0 ? "pl-8" : ""}`}
                >
                  <dt className="font-heading text-3xl font-bold tracking-tight">
                    {t.value}
                  </dt>
                  <dd className="text-sm text-muted-foreground">{t.label}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </div>
      </Wrapper>

      {/* Brand marquee: full-bleed, seamless loop (track holds two copies). */}
      <div className="overflow-hidden border-t border-border bg-muted/30 py-4">
        <div className="flex w-max animate-[stridon-marquee_45s_linear_infinite]">
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="flex items-center text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground"
            >
              <span className="px-7">{brand}</span>
              <span
                aria-hidden
                className="inline-block h-3.5 w-[2px] -skew-x-[20deg] bg-border"
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
