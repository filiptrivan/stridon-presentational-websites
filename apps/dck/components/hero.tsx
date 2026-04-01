import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Container from "@brand/shared/components/container";
import HeroHeader from "@brand/shared/components/hero-header";
import { Button } from "@brand/ui/button";

const Hero = () => {
  return (
    <HeroHeader
      title={
        <>
          Profesionalni električni alati{" "}
          <br className="hidden lg:inline-block" />
          za svaki posao
        </>
      }
      description="DCK električni alati — pouzdani, izdržljivi i dostupni. Zvanični distributer za teritoriju Srbije."
      showSvgGrid={true}
    >
      <Container delay={0.3}>
        <div className="flex gap-3 mt-6">
          <Button asChild>
            <Link
              href="https://www.prodavnicaalata.rs/proizvodjaci/dck/"
              target="_blank"
            >
              Idi na prodavnicu
              <ExternalLinkIcon className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/proizvodi/kategorije">
              Pogledaj kategorije
              <ExternalLinkIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </Container>

      <Container className="w-full z-30">
        <div className="relative mx-auto max-w-7xl rounded-2xl md:rounded-[32px] border border-neutral-200/50 bg-neutral-100 p-2 backdrop-blur-lg mt-10 md:mt-14">
          <div className="rounded-lg md:rounded-[24px] border border-neutral-200 bg-white">
            <Image
              src="/dashboard.webp"
              alt="DCK električni alati"
              priority
              width={2932}
              height={1664}
              loading="eager"
              className="rounded-3xl md:rounded-[26px]"
            />
          </div>
        </div>
      </Container>
    </HeroHeader>
  );
};

export default Hero;
