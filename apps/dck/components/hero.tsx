import Container from "@brand/shared/components/container";
import HeroHeader from "@brand/shared/components/hero-header";
import { Button } from "@brand/ui/button";
import { getImageProps } from "next/image";
import Link from "next/link";

const Hero = () => {
  const common = { alt: "DCK električni alati", sizes: "(min-width: 1280px) 1280px, 100vw" };

  const {
    props: { srcSet: desktop, ...rest },
  } = getImageProps({ ...common, src: "/dashboard.webp", width: 2932, height: 1664 });

  const {
    props: { srcSet: mobile },
  } = getImageProps({ ...common, src: "/dashboard-mobile.jpg", width: 768, height: 960 });

  return (
    <HeroHeader
      title={
        <>
          Profesionalni električni alati{" "}
          <br className="hidden lg:inline-block" />
          za svaki posao
        </>
      }
      description="DCK električni i aku alati sa zvaničnom distribucijom, servisom i produženom garancijom uz registraciju u Srbiji."
      showSvgGrid={true}
    >
      <Container delay={0.3}>
        <div className="flex gap-3 mt-6">
          <Button asChild>
            <Link href="/kontakt">
              Postani distributer
            </Link>
          </Button>
        </div>
      </Container>

      <Container className="w-full z-30">
        <div className="relative mx-auto max-w-7xl rounded-2xl md:rounded-[32px] border border-neutral-200/50 bg-neutral-100 p-2 backdrop-blur-lg mt-10 md:mt-14">
          <div className="rounded-lg md:rounded-[24px] border border-neutral-200 bg-white">
            <picture>
              <source media="(min-width: 768px)" srcSet={desktop} />
              <source srcSet={mobile} />
              {/* getImageProps is a pure function — it doesn't inject <link rel="preload"> or add
                 fetchPriority/loading props, so we set them manually for above-the-fold loading. */}
              <img
                {...rest}
                alt={common.alt}
                style={{ width: "100%", height: "auto" }}
                className="rounded-xl md:rounded-[26px]"
                fetchPriority="high"
                loading="eager"
              />
            </picture>
          </div>
        </div>
      </Container>
    </HeroHeader>
  );
};

export default Hero;
