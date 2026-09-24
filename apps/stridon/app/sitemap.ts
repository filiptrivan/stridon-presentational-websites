import type { MetadataRoute } from "next";

import { BRAND_SLUGS } from "@/constants/brands";
import { SITE_URL } from "@/constants/links";
import { getPathname } from "@/i18n/navigation";
import { routing, type StaticPathname } from "@/i18n/routing";
import { HREFLANG } from "@brand/i18n/config";

// Stridon has no product routes (it is the distributor site, purchases happen
// on prodavnicaalata.rs), so this is a static list - no API reads at build.
// No `changeFrequency` or `priority`: Google ignores both
// (https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
// and so does Bing, and in `MetadataRoute.Sitemap` they are optional.
const staticPages: StaticPathname[] = [
  "/",
  "/brendovi",
  "/katalozi",
  "/servis",
  "/o-nama",
  "/b2b",
  "/kontakt",
  "/politikaprivatnosti",
  "/uslovi-koriscenja",
  "/podacizaidentifikaciju",
];

/**
 * Every URL is listed once per locale, and each entry names all of its
 * translations under `alternates.languages`.
 *
 * `getPathname` rather than string concatenation, because the English routes
 * are not the Serbian ones with a prefix: `/o-nama` is `/en/about`. Building
 * them by hand here would silently drift from `routing.ts` the first time a
 * route is renamed.
 */
type Href = Parameters<typeof getPathname>[0]["href"];

function entriesFor(href: Href): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [
      HREFLANG[locale],
      `${SITE_URL}${getPathname({ href, locale })}`,
    ]),
  );

  return routing.locales.map((locale) => ({
    url: `${SITE_URL}${getPathname({ href, locale })}`,
    alternates: { languages },
  }));
}

/**
 * No `lastModified`. A `new Date()` here is dynamic IO under `cacheComponents`,
 * which turned the whole route into a function invocation on every crawl, and
 * it bought nothing: all 68 entries carried the same "now", which is exactly
 * the pattern Google says it ignores. A real date needs a real signal, and the
 * only one this site has is a CMS edit, which nothing reports here yet.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPages.flatMap((path) => entriesFor(path)),
    ...BRAND_SLUGS.flatMap((slug) =>
      entriesFor({ pathname: "/brendovi/[slug]", params: { slug } }),
    ),
  ];
}
