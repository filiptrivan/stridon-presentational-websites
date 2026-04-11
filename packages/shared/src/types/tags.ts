export interface Tag {
  id: number;
  name: string;
  slug: string;
  color: string;
  orderNumber: number | null;
  description: string;
  metaTitle: string;
  metaDescription: string;
  imageUrl: string;
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
