import { getFilteredProducts } from "@brand/shared/lib/api";
import ProductCard from "./products/product-card";
import SectionHeader from "./section-header";
import Section from "./section";
import Wrapper from "./wrapper";

const FeaturedProducts = async () => {
  let products;
  try {
    products = await getFilteredProducts(0, 4);
  } catch {
    return null;
  }

  if (!products || products.data.length === 0) return null;

  return (
    <Section>
      <Wrapper>
        <SectionHeader
          title="Izdvajamo iz ponude"
          description="Najpopularniji alati iz našeg asortimana"
          action={{ label: "Pogledaj sve", href: "/proizvodi" }}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mt-10">
          {products.data.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </Wrapper>
    </Section>
  );
};

export default FeaturedProducts;
