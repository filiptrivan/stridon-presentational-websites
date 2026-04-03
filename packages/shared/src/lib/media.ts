import type { ProductMedia } from "@brand/shared/types/products";

export const MEDIA_TYPE = { IMAGE: 0, VIDEO: 1 } as const;

export function isVideoMedia(item: ProductMedia): boolean {
  return item.mediaType === MEDIA_TYPE.VIDEO;
}
