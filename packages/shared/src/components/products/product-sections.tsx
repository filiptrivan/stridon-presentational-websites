import { Prose } from "@brand/ui/prose";
import SectionHeader from "../section-header";

interface ProductSectionsProps {
  htmlDescription?: string | null;
  specification?: string | null;
}

// Stacked and always expanded, never tabs: the same call as the store's
// product page (umbrella ADR 0026, tabs rejected on Baymard's evidence), and
// a stacked section needs no JavaScript to show.
const ProductSections = ({
  htmlDescription,
  specification,
}: ProductSectionsProps) => {
  const sections = [
    { title: "Detalji", html: htmlDescription },
    { title: "Specifikacija", html: specification },
  ].filter((section) => section.html);

  return (
    <div className="space-y-12 lg:space-y-16">
      {sections.map((section) => (
        <section key={section.title}>
          <SectionHeader title={section.title} size="sub" />
          <Prose
            variant="product"
            dangerouslySetInnerHTML={{ __html: section.html! }}
          />
        </section>
      ))}
    </div>
  );
};

export default ProductSections;
