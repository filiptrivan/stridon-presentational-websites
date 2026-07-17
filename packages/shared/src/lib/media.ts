import type { ProductMedia } from "@brand/shared/types/products";

// Mirrors the backend MediaTypeCodes enum. Intentional cross-repo copy of the media-type helpers in
// pa-storefront (packages/storefront-core/src/constants/media.ts) — the two repos share no package,
// so keep the enum values in sync with the backend + that file.
export const MEDIA_TYPE = { IMAGE: 0, VIDEO: 1, YOUTUBE: 2 } as const;

export function isVideoMedia(item: ProductMedia): boolean {
  return item.mediaType === MEDIA_TYPE.VIDEO;
}

// These presentational sites don't render YouTube embeds (the main PACMS storefront does), so drop
// any YouTube item — its `url` is a bare 11-char video id that would otherwise render as a broken
// <img>. Positive allowlist so a future unknown media type is skipped too, never mis-rendered.
// TODO (someday): render YouTube here too — poster + click-to-load facade, like pa-storefront's
// YoutubeFacade — instead of dropping mediaType=2; then this becomes IMAGE || VIDEO || YOUTUBE.
export function isRenderableMedia(item: ProductMedia): boolean {
  return (
    item.mediaType === MEDIA_TYPE.IMAGE || item.mediaType === MEDIA_TYPE.VIDEO
  );
}

export function isVideoUrl(url: string): boolean {
  return /\.mp4(?:[?#]|$)/i.test(url);
}
