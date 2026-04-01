import { getFilteredProducts } from "@brand/shared/lib/api";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ProductCard from "./products/product-card";
import Section from "./section";
import { Button } from "@brand/ui/button";
import Wrapper from "./wrapper";

const FeaturedProducts = async () => {
  let products;
  try {
    products = await getFilteredProducts(0, 4);
  } catch (error) {
    console.error("Error fetching products", error);
    return null;
  }

  if (!products || products.data.length === 0) return null;

  return (
    <Section>
      <Wrapper>
        <div className="flex flex-col items-start justify-start lg:items-center lg:justify-center">
          <h2 className="text-3xl lg:text-4xl font-semibold text-left lg:text-center tracking-tight">
            Izdvajamo iz ponude
          </h2>
          <p className="text-base lg:text-lg font-normal text-muted-foreground text-left lg:text-center mt-2 max-w-md">
            Najpopularniji alati iz našeg asortimana
          </p>
          <Button variant="link" asChild className="mt-2 p-0!">
            <Link href="/proizvodi">
              Pogledaj sve
              <ArrowRight />
            </Link>
          </Button>
        </div>

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
