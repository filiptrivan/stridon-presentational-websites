import Container from "./container";
import HeroHeader from "./hero-header";
import { Button } from "@brand/ui/button";
import { Home, ShoppingBag } from "lucide-react";
import Link from "next/link";

const DEFAULT_LABELS = {
  title: "Stranica nije pronađena",
  description:
    "Stranica koju tražiš ne postoji ili je premeštena. Proveri adresu ili se vrati na početnu.",
  home: "Početna",
  secondary: "Sve kategorije",
};

export type NotFoundLabels = Partial<typeof DEFAULT_LABELS>;

interface NotFoundPageProps {
  labels?: NotFoundLabels;
  homeHref?: string;
  /** The second button. `null` removes it - Stridon has no product catalog, so
      the default target would be a link from a 404 to another 404. */
  secondaryHref?: string | null;
}

const NotFoundPage = ({
  labels,
  homeHref = "/",
  secondaryHref = "/proizvodi/kategorije",
}: NotFoundPageProps) => {
  const t = { ...DEFAULT_LABELS, ...labels };

  return (
    <HeroHeader title={t.title} description={t.description}>
      <Container delay={0.3}>
        <div className="flex items-center gap-3 mt-6">
          <Button variant="outline" size="sm" asChild>
            <Link href={homeHref}>
              <Home className="size-4" />
              {t.home}
            </Link>
          </Button>
          {secondaryHref ? (
            <Button variant="ghost" size="sm" asChild>
              <Link href={secondaryHref}>
                <ShoppingBag className="size-4" />
                {t.secondary}
              </Link>
            </Button>
          ) : null}
        </div>
      </Container>
    </HeroHeader>
  );
};

export default NotFoundPage;
