export interface Tag {
  id: number;
  name: string;
  slug: string;
  color: string;
  orderNumber: number | null;
  metaTitle: string;
  metaDescription: string;
  // Already nullable on the backend (StorefrontTagDTO.ImageUrl has always been
  // `string?`); this declaration was simply wrong. See the note in products.ts.
  imageUrl: string | null;
  bannerMediaUrl: string | null;
  bannerImageWidth: number | null;
  bannerImageHeight: number | null;
  bannerVideoThumbnailUrl: string | null;
  bannerVideoDurationSeconds: number | null;
  isPromotion: boolean;
  discountPercentage: number | null;
  htmlDescription: string | null;
  brandImageUrl: string | null;
  brandSlug: string | null;
}
