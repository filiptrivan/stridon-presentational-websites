import CatalogCardsGrid from "@brand/shared/components/catalog-cards-grid";
import HeroHeader from "@brand/shared/components/hero-header";
import Section from "@brand/shared/components/section";
import StatusMessage from "@brand/shared/components/status-message";
import Wrapper from "@brand/shared/components/wrapper";
import { getCatalogs } from "@brand/shared/lib/api";
import { createPageMetadata } from "@brand/shared/lib/metadata";
import { BookOpen } from "lucide-react";

export const metadata = createPageMetadata({
  title: "Katalozi",
  description: "Pregledaj i preuzmi kataloge proizvoda u PDF formatu.",
  canonicalUrl: "/katalozi/",
});

const CatalogsPage = async () => {
  const catalogs = await getCatalogs();

  return (
    <div>
      <HeroHeader
        title="Katalozi"
        description="Pregledaj i preuzmi kataloge proizvoda u PDF formatu."
      />

      <Section>
        <Wrapper>
          {catalogs.length === 0 ? (
            <StatusMessage
              icon={BookOpen}
              title="Trenutno nema dostupnih kataloga."
              description="Proveri ponovo uskoro."
            />
          ) : (
            <CatalogCardsGrid catalogs={catalogs} />
          )}
        </Wrapper>
      </Section>
    </div>
  );
};

export default CatalogsPage;
