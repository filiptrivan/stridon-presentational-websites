import Container from "@brand/shared/components/container";
import Wrapper from "@brand/shared/components/wrapper";
import { Button } from "@brand/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

// Brands Stridon officially imports/distributes. Rendered as a typographic
// roster (no logo assets needed) that doubles as the hero's signature strip.
const BRANDS = [
  "DeWalt",
  "Bosch",
  "Stanley",
  "Makita",
  "Knipex",
  "Wiha",
  "Högert",
  "REMS",
  "Wera",
  "GTV",
];

const TRUST = [
  { value: "30+", label: "brendova" },
  { value: "120+", label: "dilera" },
  { value: "10.630+", label: "kupaca" },
];

const Hero = () => {
  return (
    <div className="relative overflow-hidden border-b border-border">
      {/* Soft brand-red glow, kept subtle - the accent, not the subject. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-12%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(229,1,19,0.10),transparent_70%)]"
      />

      <Wrapper className="py-20 sm:py-28 lg:py-32">
        <div className="max-w-3xl">
          <Container>
            <p className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.14em] text-primary">
              <span className="h-px w-8 bg-primary" />
              Zvanični uvoznik i distributer alata
            </p>
          </Container>

          <Container delay={0.5}>
            <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.03] tracking-tight sm:text-6xl lg:text-7xl">
              Svetski brendovi alata,{" "}
              <span className="text-primary">zvanično</span> u Srbiji.
            </h1>
          </Container>

          <Container delay={1}>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Stridon Group je uvoznik i veleprodaja profesionalnog alata. Preko
              30 brendova, tehnička podrška, garancija i brza isporuka širom
              Srbije.
            </p>
          </Container>

          <Container delay={1.5}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
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
            <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
              {TRUST.map((t) => (
                <div key={t.label} className="flex items-baseline gap-2">
                  <dt className="font-heading text-2xl font-bold tracking-tight">
                    {t.value}
                  </dt>
                  <dd className="text-sm text-muted-foreground">{t.label}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </div>
      </Wrapper>

      {/* Brand roster strip - the signature element of this hero. */}
      <div className="border-t border-border bg-muted/40">
        <Wrapper className="py-5">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/50">
              Zastupamo
            </span>
            {BRANDS.map((brand) => (
              <span
                key={brand}
                className="text-sm font-medium text-muted-foreground"
              >
                {brand}
              </span>
            ))}
          </div>
        </Wrapper>
      </div>
    </div>
  );
};

export default Hero;
