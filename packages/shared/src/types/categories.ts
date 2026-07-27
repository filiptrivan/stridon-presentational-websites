import type { CategoryBreadcrumb } from "./products";

export interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
  ogImageUrl: string | null;
  htmlDescription: string | null;
  metaTitle: string;
  metaDescription: string;
  subCategories: Category[];
  categoryBreadcrumbs: CategoryBreadcrumb[];
}
