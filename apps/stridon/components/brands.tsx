import Container from "@brand/shared/components/container";
import Wrapper from "@brand/shared/components/wrapper";
import { BRANDS } from "@/constants/content";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Typographic brand wall: a hairline catalog grid (no logo assets needed).
// The last cell is the "all brands" link so the grid stays complete.
const Brands = () => {
  return (
    <section className="border-b border-border">
      <Wrapper className="py-20 lg:py-28">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                <span
                  aria-hidden
                  className="inline-block h-3.5 w-6 -skew-x-[14deg] bg-primary"
                />
                Brendovi
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight lg:text-4xl">
                Svetski brendovi, zvanično kod nas
              </h2>
            </div>
            <p className="max-w-sm text-muted-foreground">
              Za svaki brend koji zastupamo garantujemo originalnu robu,
              tehničku podršku i servis u Srbiji.
            </p>
          </div>
        </Container>

        <Container delay={0.5}>
          <div className="mt-12 grid grid-cols-2 border-l border-t border-border md:grid-cols-3 lg:grid-cols-4">
            {BRANDS.slice(0, 11).map((brand) => (
              <div
                key={brand}
                className="group flex h-24 items-center justify-between border-b border-r border-border px-5 lg:px-6"
              >
                <span className="font-heading text-lg font-semibold tracking-tight transition-colors duration-300 group-hover:text-primary lg:text-xl">
                  {brand}
                </span>
                <span
                  aria-hidden
                  className="h-2 w-6 origin-left -skew-x-[14deg] scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
                />
              </div>
            ))}
            <Link
              href="/brendovi"
              className="group flex h-24 items-center justify-between border-b border-r border-border bg-muted/40 px-5 transition-colors duration-300 hover:bg-primary lg:px-6"
            >
              <span className="font-heading text-lg font-semibold tracking-tight text-primary transition-colors duration-300 group-hover:text-primary-foreground lg:text-xl">
                Svi brendovi
              </span>
              <ArrowRight className="size-5 text-primary transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary-foreground" />
            </Link>
          </div>
        </Container>
      </Wrapper>
    </section>
  );
};

export default Brands;
