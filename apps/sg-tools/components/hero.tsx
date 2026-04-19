import Container from "@brand/shared/components/container";
import HeroHeader from "@brand/shared/components/hero-header";
import { Button } from "@brand/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <HeroHeader
      title={
        <>
          SG TOOLS
          <span className="block">Građen znanjem</span>
        </>
      }
      description="SG TOOLS je brend nastao iz višedecenijskog iskustva porodične firme koja poznaje potrebe majstora, servisa i kompanija koje se oslanjaju na alat svaki dan."
      showSvgGrid={true}
    >
      <Container delay={0.3}>
        <div className="flex gap-3 mt-6">
          <Button asChild>
            <Link href="/kontakt">Postani distributer</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              href="https://media.prodavnicaalata.rs/uploads//catalogues/58/files/SG%20TOOLS%20katalog.pdf"
              target="_blank"
            >
              Pogledaj katalog
              <ExternalLinkIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </HeroHeader>
  );
};

export default Hero;
