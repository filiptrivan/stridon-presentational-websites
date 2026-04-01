import CategoryCard from "./products/category-card";
import Section from "./section";
import { Button } from "@brand/ui/button";
import Wrapper from "./wrapper";
import { getLeafCategories } from "@brand/shared/lib/api";
import type { Category } from "@brand/shared/types/categories";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Categories = async () => {
  let categories: Category[] = [];
  try {
    categories = await getLeafCategories();
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return null;
  }

  if (!categories || categories.length === 0) return null;

  return (
    <Section className="relative">
      <Wrapper>
        <div className="flex flex-col items-start justify-start lg:items-center lg:justify-center">
          <h2 className="text-3xl lg:text-4xl font-semibold text-left lg:text-center tracking-tight">
            Kategorije
          </h2>
          <p className="text-base lg:text-lg font-normal text-muted-foreground text-left lg:text-center mt-2 max-w-md">
            Najpopularnije kategorije iz našeg asortimana.
          </p>
          <Button variant="link" asChild className="mt-2 p-0!">
            <Link href="/proizvodi/kategorije">
              Pogledaj sve
              <ArrowRight />
            </Link>
          </Button>
        </div>

        <div className="w-full mt-10">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 sm:gap-3 lg:gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </Wrapper>
    </Section>
  );
};

export default Categories;
