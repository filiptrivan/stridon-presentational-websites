import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import Container from "@brand/shared/components/container";
import HeroHeader from "@brand/shared/components/hero-header";
import HeroSupportBadges from "./hero-support-badges";
import { Button } from "@brand/ui/button";

const Hero = () => {
  return (
    <HeroHeader
      pretitle={<HeroSupportBadges />}
      title="Profesionalni alat nastao iz 30 godina iskustva"
      description="SG Tools je razvijen na osnovu višedecenijskog iskustva u prodaji i distribuciji alata, iz svakodnevnog rada sa majstorima, serviserima i firmama koje traže pouzdan, trajan i cenovno pristupačan alat."
      showSvgGrid={true}
    >
      <Container delay={0.3}>
        <div className="flex gap-3 mt-6">
          <Button asChild>
            <Link
              href="https://www.prodavnicaalata.rs/proizvodjaci/sg-tools/"
              target="_blank"
            >
              Idi na prodavnicu
              <ExternalLinkIcon className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="https://stridon.milev.rs/" target="_blank">
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
