import Container from "./container";
import HeroHeader from "./hero-header";
import { Button } from "@brand/ui/button";
import { Home, ShoppingBag } from "lucide-react";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <HeroHeader
      title="Stranica nije pronađena"
      description="Stranica koju tražiš ne postoji ili je premeštena. Proveri adresu ili se vrati na početnu."
    >
      <Container delay={0.3}>
        <div className="flex items-center gap-3 mt-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <Home className="size-4" />
              Početna
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/proizvodi/kategorije">
              <ShoppingBag className="size-4" />
              Sve kategorije
            </Link>
          </Button>
        </div>
      </Container>
    </HeroHeader>
  );
};

export default NotFoundPage;
