import Container from "@brand/shared/components/container";
import Wrapper from "@brand/shared/components/wrapper";
import BrandLogo from "@/components/brand-logo";
import { FEATURED_BRANDS } from "@/constants/brands";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Brand wall: hairline grid of full-bleed 2:1 brand tiles.
// The last cell is the "all brands" link so the grid stays complete.
const Brands = () => {
  return (
    <section className="border-b border-border">
      <Wrapper className="py-20 lg:py-28">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                Brendovi koje zvanično zastupamo
              </h2>
            </div>
            <p className="max-w-sm text-muted-foreground">
              Za svaki brend iz našeg portfolija garantujemo originalnu robu,
              tehničku podršku i servis u Srbiji.
            </p>
          </div>
        </Container>

        <Container delay={0.5}>
          <div className="mt-12 grid grid-cols-2 border-l border-t border-border md:grid-cols-3 lg:grid-cols-4">
            {FEATURED_BRANDS.map((brand) => (
              <Link
                key={brand.slug}
                href={`/brendovi/${brand.slug}`}
                className="border-b border-r border-border transition-opacity duration-300 hover:opacity-85"
              >
                <BrandLogo brand={brand} />
              </Link>
            ))}
            <Link
              href="/brendovi"
              className="group flex aspect-[2/1] items-center justify-between border-b border-r border-border bg-muted/40 px-5 transition-colors duration-300 hover:bg-primary lg:px-6"
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
