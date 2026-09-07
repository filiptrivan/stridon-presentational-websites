import type { OwnBrand as OwnBrandData } from "@/constants/about";
import Container from "@brand/shared/components/container";
import Wrapper from "@brand/shared/components/wrapper";
import { Button } from "@brand/ui/button";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

interface OwnBrandProps {
  brand: OwnBrandData;
}

// Stridon is not only a distributor: SG TOOLS and DCK are the group's own
// lines. One section per brand, both reading copy left / photo right.
const OwnBrand = ({ brand }: OwnBrandProps) => {
  return (
    <section className="border-b border-border">
      <Wrapper className="py-20 lg:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Container>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                {brand.heading}
              </h2>

              {brand.paragraphs.map((paragraph, index) => (
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
                    {brand.linkLabel}
                    <ExternalLink className="size-4" />
                  </a>
                </Button>
              </div>
            </div>
          </Container>

          <Container delay={0.5}>
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-border bg-muted/40">
              <Image
                src={brand.image.src}
                alt={brand.image.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Container>
        </div>
      </Wrapper>
    </section>
  );
};

export default OwnBrand;
