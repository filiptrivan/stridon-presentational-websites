import Container from "@brand/shared/components/container";
import HeroHeader from "@brand/shared/components/hero-header";
import { createNotFoundMetadata } from "@brand/shared/lib/metadata";
import { Button } from "@brand/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export const metadata = createNotFoundMetadata();

// App-local copy of the shared 404: that one also links to
// /proizvodi/kategorije, a route this site does not have.
const NotFound = () => {
  return (
    <HeroHeader
      title="Stranica nije pronađena"
      description="Stranica koju tražiš ne postoji ili je premeštena. Proveri adresu ili se vrati na početnu."
    >
      <Container delay={0.3}>
        <div className="mt-6 flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <Home className="size-4" />
              Početna
            </Link>
          </Button>
        </div>
      </Container>
    </HeroHeader>
  );
};

export default NotFound;
