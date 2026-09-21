import type { MetadataRoute } from "next";

import { BRAND_SLUGS } from "@/constants/brands";
import { SITE_URL } from "@/constants/links";
import { getPathname } from "@/i18n/navigation";
import { routing, type StaticPathname } from "@/i18n/routing";
import { HREFLANG } from "@brand/i18n/config";

// Stridon has no product routes (it is the distributor site, purchases happen
// on prodavnicaalata.rs), so this is a static list - no API reads at build.
const staticPages: {
  path: StaticPathname;
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/brendovi", changeFrequency: "monthly", priority: 0.9 },
  { path: "/katalozi", changeFrequency: "monthly", priority: 0.8 },
  { path: "/servis", changeFrequency: "monthly", priority: 0.7 },
  { path: "/o-nama", changeFrequency: "monthly", priority: 0.7 },
  { path: "/b2b", changeFrequency: "monthly", priority: 0.7 },
  { path: "/kontakt", changeFrequency: "monthly", priority: 0.6 },
  { path: "/politika-privatnosti", changeFrequency: "yearly", priority: 0.3 },
  { path: "/uslovi-koriscenja", changeFrequency: "yearly", priority: 0.3 },
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

function entriesFor(
  href: Href,
  lastModified: Date,
  changeFrequency: "weekly" | "monthly" | "yearly",
  priority: number,
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [
      HREFLANG[locale],
      `${SITE_URL}${getPathname({ href, locale })}`,
    ]),
  );

  return routing.locales.map((locale) => ({
    url: `${SITE_URL}${getPathname({ href, locale })}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    ...staticPages.flatMap((page) =>
      entriesFor(page.path, lastModified, page.changeFrequency, page.priority),
    ),
    ...BRAND_SLUGS.flatMap((slug) =>
      entriesFor(
        { pathname: "/brendovi/[slug]", params: { slug } },
        lastModified,
        "monthly",
        0.6,
      ),
    ),
  ];
}
