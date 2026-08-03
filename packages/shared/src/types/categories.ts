import type { CategoryBreadcrumb } from "./products";

export interface Category {
  id: number;
  name: string;
  slug: string;
  // Null when the category has no image — see the note in products.ts.
  imageUrl: string | null;
  ogImageUrl: string | null;
  htmlDescription: string | null;
  metaTitle: string;
  metaDescription: string;
  subCategories: Category[];
  categoryBreadcrumbs: CategoryBreadcrumb[];
}
