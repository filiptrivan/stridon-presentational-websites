import Container from "@brand/shared/components/container";
import HeroSupportBadge from "./hero-support-badge";

function HeroSupportBadges() {
  return (
    <Container>
      <div className="mb-5 sm:mb-6 flex flex-col items-center justify-center gap-2">
        <p className="text-xs lg:text-sm text-muted-foreground">
          Brend podržan od strane
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <HeroSupportBadge
            href="https://www.stridon.rs"
            label="Stridon Group"
          />
          <HeroSupportBadge
            href="https://www.prodavnicaalata.rs/"
            label="Prodavnica Alata"
          />
        </div>
      </div>
    </Container>
  );
}

export default HeroSupportBadges;
