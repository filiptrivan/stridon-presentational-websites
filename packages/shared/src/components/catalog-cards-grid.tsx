import CatalogCard from "@brand/shared/components/catalog-card";
import type { Catalog } from "@brand/shared/types/catalogs";

interface CatalogCardsGridProps {
  catalogs: Catalog[];
}

const CatalogCardsGrid = ({ catalogs }: CatalogCardsGridProps) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4">
    {catalogs.map((catalog) => (
      <CatalogCard key={catalog.id} catalog={catalog} />
    ))}
  </div>
);

export default CatalogCardsGrid;
