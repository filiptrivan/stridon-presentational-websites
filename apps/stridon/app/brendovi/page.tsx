import BrandLogo from "@/components/brand-logo";
import PageHeader from "@/components/page-header";
import { BRANDS } from "@/constants/brands";
import Container from "@brand/shared/components/container";
import Wrapper from "@brand/shared/components/wrapper";
import { createPageMetadata } from "@brand/shared/lib/metadata";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "Brendovi",
  description:
    "Brendovi mašina, pribora, električnog, ručnog i akumulatorskog alata za koje je Stridon Group zvanični uvoznik i distributer u Srbiji.",
  canonicalUrl: "/brendovi",
});

const BrendoviPage = () => {
  return (
    <div>
      <PageHeader
        title="Uvoznik i distributer najboljih brendova"
        lede="Brendovi mašina, pribora, električnog, ručnog i akumulatorskog alata koje uvozimo i za koje je naša firma uvoznik i distributer na teritoriji Srbije."
      />

      <section className="border-b border-border">
        <Wrapper className="py-14 lg:py-20">
          <Container>
            <div className="grid grid-cols-2 border-l border-t border-border lg:grid-cols-3">
              {BRANDS.map((brand) => (
                <Link
                  key={brand.slug}
                  href={`/brendovi/${brand.slug}`}
                  className="group flex flex-col border-b border-r border-border transition-colors duration-300 hover:bg-muted/40"
                >
                  <BrandLogo
                    brand={brand}
                    className="border-b border-border"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />

                  <div className="flex flex-1 flex-col p-6 lg:p-7">
                    <div className="flex items-center gap-0 sm:gap-3">
                      {/* Hover-only marker, so it just indents the name on touch. */}
                      <span
                        aria-hidden
                        className="hidden h-2.5 w-5 shrink-0 origin-left -skew-x-[14deg] scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100 sm:block"
                      />
                      <h2 className="font-heading text-lg font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1">
                        {brand.name}
                      </h2>
                    </div>

                    <p className="mt-3 line-clamp-4 text-[15px] leading-relaxed text-muted-foreground">
                      {brand.blurb}
                    </p>

                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-primary">
                      Idi na brend
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Wrapper>
      </section>
    </div>
  );
};

export default BrendoviPage;
