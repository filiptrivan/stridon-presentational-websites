import Container from "@brand/shared/components/container";
import HeroHeader from "@brand/shared/components/hero-header";
import { Button } from "@brand/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <HeroHeader
      title="Građen znanjem"
      description="SG Tools je rođen iz porodičnog biznisa sa alatima koji traje 30 godina, iz svakodnevnog rada sa majstorima, serviserima i firmama koje traže pouzdan, trajan i cenovno pristupačan alat."
      showSvgGrid={true}
    >
      <Container delay={0.3}>
        <div className="flex gap-3 mt-6">
          <Button asChild>
            <Link href="/kontakt">Postani distributer</Link>
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
