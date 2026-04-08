export interface CategoryBreadcrumb {
  name: string;
  path: string;
}

export interface ProductMedia {
  url: string;
  mediaType: number;
  width: number | null;
  height: number | null;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
}

/** Lightweight DTO for product cards in lists, grids, and carousels. */
export interface ProductCardData {
  id: number;
  defaultProductVariantId: number;
  title: string;
  slug: string;
  displayPrice: number;
  originalPrice: number | null;
  discountPercentage: number | null;
  hasDiscount: boolean;
  imageUrl: string;
  brandName: string;
  brandImageUrl: string;
  brandWarrantyImageUrl: string | null;
  isBackorder: boolean;
  tags: { name: string; color: string; orderNumber: number }[];
  averageRating: number | null;
  reviewCount: number;
  maxOrderQuantity: number | null;
}

/** Full product DTO for product detail pages. */
export interface Product extends ProductCardData {
  description: string;
  htmlDescription: string;
  specification: string | null;
  countryName: string | null;
  metaTitle: string;
  metaDescription: string;
  brandSlug: string;
  brandWarrantyImageWidth: number | null;
  brandWarrantyImageHeight: number | null;
  categoryName: string;
  categorySlug: string;
  categoryBreadcrumbs: CategoryBreadcrumb[];
  productMedia: ProductMedia[];
  weightKg: number | null;
  heightCm: number | null;
  sku: string | null;
  relatedProducts: ProductCardData[];
}

export interface ProductCardsResult {
  data: ProductCardData[];
  totalRecords: number;
}

export interface SitemapEntry {
  slug: string;
  modifiedAt: string;
}
