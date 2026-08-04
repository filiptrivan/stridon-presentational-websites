// Single source of truth for the image hosts we trust to fetch/optimize. Drives:
//   - next.config `images.remotePatterns` (the next/image optimizer allowlist), and
//   - `isTrustedImageUrl` (the /api/og route's server-side fetch allowlist).
// Keep dependency-free so next.config.ts can import it at config-load time.

// New system: all images upload to this public R2 bucket (backend S3PublicEndpoint).
export const PUBLIC_IMAGE_HOST = "assets.prodavnicaalata.rs";

// TRANSITIONAL: the R2 dev host that served native media before the custom domain
// above existed. Every native URL already stored in the DB still points here — the
// bulk prefix rewrite (step 5 of the media-hosting runbook) has not run yet, and the
// old bucket stays up indefinitely after it does. Both hosts must be trusted for the
// whole transition. Remove only once that rewrite is verified.
export const PREVIOUS_PUBLIC_IMAGE_HOST =
  "pub-0c08792ef71a4e14abb8d23b3a1fcdaf.r2.dev";

// TEMPORARY (legacy): un-migrated product/category/brand/catalog images still live
// on this one dedicated media subdomain of the old shop. Verified against prod
// (2026-06) — it is the ONLY non-R2 image host in any image column. Deliberately a
// dedicated media host, NOT the apex / `www.` that will become the new platform, so
// trusting it can never reach the new app. Remove once everything is re-hosted to
// R2 — at which point the allowlist is R2-only.
export const LEGACY_IMAGE_HOST = "media.prodavnicaalata.rs";

// Exact hosts (no wildcard) trusted for image fetch/optimization. Exact-match so a
// future subdomain on a now-ours domain isn't implicitly trusted.
export const TRUSTED_IMAGE_HOSTS: readonly string[] = [
  PUBLIC_IMAGE_HOST,
  PREVIOUS_PUBLIC_IMAGE_HOST,
  LEGACY_IMAGE_HOST,
];

// True for image URLs safe to fetch server-side and render into an OG card. In
// lockstep with remotePatterns (same host list) so any image displayable on a page
// is also renderable in its OG card. https-only, exact-host.
export function isTrustedImageUrl(rawUrl: string): boolean {
  try {
    const { protocol, hostname } = new URL(rawUrl);
    return protocol === "https:" && TRUSTED_IMAGE_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}
