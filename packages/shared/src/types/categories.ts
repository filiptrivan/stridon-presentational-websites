import type { CategoryBreadcrumb } from "./products";

export interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
  ogImageUrl: string | null;
  description: string;
  metaTitle: string;
  metaDescription: string;
  subCategories: Category[];
  categoryBreadcrumbs: CategoryBreadcrumb[];
}
