import Container from "@brand/shared/components/container";
import Wrapper from "@brand/shared/components/wrapper";
import { Button } from "@brand/ui/button";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Full-bleed photo under an ink veil, centered type on top, and the red
// diagonal from the logo running down the right edge - the same beam that
// closes the page in PartnerCta.
const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      <Image
        src="/about/sgtools-dck-tim.webp"
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-foreground/85" />

      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 top-[-20%] hidden h-[140%] w-36 -skew-x-[14deg] bg-primary lg:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-36 top-[-20%] hidden h-[140%] w-10 -skew-x-[14deg] bg-background/10 lg:block"
      />

      <Wrapper className="relative py-24 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-4xl text-center text-background">
          <Container>
            <h1 className="text-balance text-[clamp(2.25rem,5.2vw,4rem)] font-semibold leading-[1.04] tracking-tight">
              Uvoz, distribucija i prodaja profesionalnog alata u Srbiji.
            </h1>
          </Container>

          <Container delay={0.5}>
            <p className="mx-auto mt-7 max-w-2xl text-lg text-background/70">
              Stridon Group stoji iza najuspešnije prodavnice alata u Srbiji.
              Preko 120 dilera, više od 30 svetskih brendova i sopstveni
              servis, uz isporuku širom zemlje.
            </p>
          </Container>

          <Container delay={1}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
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
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-background/30 bg-transparent text-background hover:bg-background hover:text-foreground"
              >
                <Link href="/katalozi">Pogledaj katalog</Link>
              </Button>
            </div>
          </Container>
        </div>
      </Wrapper>
    </section>
  );
};

export default Hero;
