import {
  type SpecSheetTable,
  specSheetTables,
} from "@brand/shared/lib/spec-sheet-tables";
import type { SpecRow } from "@brand/shared/types/products";
import { Prose } from "@brand/ui/prose";
import SectionHeader from "../section-header";

interface ProductSectionsProps {
  htmlDescription?: string | null;
  /** The product read's spec sheet, in the page's order. */
  specRows: SpecRow[];
}

// Stacked and always expanded, never tabs: the same call as the store's
// product page (umbrella ADR 0026, tabs rejected on Baymard's evidence), and
// a stacked section needs no JavaScript to show. A section with nothing in it
// renders nothing, heading included.
const ProductSections = ({ htmlDescription, specRows }: ProductSectionsProps) => {
  const specTables = specSheetTables(specRows);
  if (!htmlDescription && specTables.length === 0) return null;

  return (
    <div className="space-y-12 lg:space-y-16">
      {htmlDescription && (
        <section>
          <SectionHeader title="Detalji" size="sub" />
          <Prose
            variant="product"
            dangerouslySetInnerHTML={{ __html: htmlDescription }}
          />
        </section>
      )}
      {specTables.length > 0 && (
        <section>
          <SectionHeader title="Specifikacija" size="sub" />
          <SpecSheet tables={specTables} />
        </section>
      )}
    </div>
  );
};

/** The spec sheet: a two-column table per `SpecSheetTable`, label then value. */
const SpecSheet = ({ tables }: { tables: SpecSheetTable[] }) => (
  <div className="max-w-2xl space-y-6">
    {tables.map((table, index) => (
      <div key={index}>
        {table.heading && (
          <h3 className="pb-1 text-base font-semibold border-b border-border">
            {table.heading}
          </h3>
        )}
        <table className="w-full text-sm">
          <tbody className="divide-y divide-border">
            {table.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <th
                  scope="row"
                  className="w-1/2 py-2 pr-4 text-left align-top font-normal text-muted-foreground"
                >
                  {row.label}
                </th>
                <td className="py-2 align-top">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))}
  </div>
);

export default ProductSections;
