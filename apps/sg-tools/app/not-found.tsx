import Container from "@brand/shared/components/container";
import HeroHeader from "@brand/shared/components/hero-header";
import { Button } from "@brand/ui/button";
import { Home, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <HeroHeader
      title="Stranica nije pronađena"
      description="Stranica koju tražiš ne postoji ili je premeštena. Proveri adresu ili se vrati na početnu."
    >
      <Container delay={0.3}>
        <div className="flex items-center gap-3 mt-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <Home className="size-4" />
              Početna
            </Button>
          </Link>
          <Link href="/proizvodi/kategorije">
            <Button variant="ghost" size="sm">
              <ShoppingBag className="size-4" />
              Sve kategorije
            </Button>
          </Link>
        </div>
      </Container>
    </HeroHeader>
  );
}
