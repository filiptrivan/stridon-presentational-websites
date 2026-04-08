import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import Container from "@brand/shared/components/container";
import HeroBadge from "@brand/shared/components/hero-badge";
import HeroBadges from "@brand/shared/components/hero-badges";
import HeroHeader from "@brand/shared/components/hero-header";
import { Button } from "@brand/ui/button";

const SG_BADGE_CLASS =
  "text-white relative before:absolute before:inset-0 before:-z-10 before:rounded-3xl before:bg-gradient-to-b before:from-neutral-700 before:to-neutral-900 before:p-[1px] before:content-[''] after:absolute after:inset-[1px] after:-z-10 after:rounded-[22px] after:bg-[#181818]/60";

const Hero = () => {
  return (
    <HeroHeader
      pretitle={
        <HeroBadges heading="Brend podržan od strane">
          <HeroBadge
            href="https://www.stridon.rs"
            label="Stridon Group"
            className={SG_BADGE_CLASS}
          />
          <HeroBadge
            href="https://www.prodavnicaalata.rs/"
            label="Prodavnica Alata"
            className={SG_BADGE_CLASS}
          />
        </HeroBadges>
      }
      title="Profesionalni alat nastao iz 30 godina iskustva"
      description="SG Tools je razvijen na osnovu višedecenijskog iskustva u prodaji i distribuciji alata, iz svakodnevnog rada sa majstorima, serviserima i firmama koje traže pouzdan, trajan i cenovno pristupačan alat."
      showSvgGrid={true}
    >
      <Container delay={0.3}>
        <div className="flex gap-3 mt-6">
          <Button asChild>
            <Link href="/kontakt">
              Postani distributer
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
