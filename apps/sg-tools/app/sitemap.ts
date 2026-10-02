import type { MetadataRoute } from "next";

import { SITE_URL } from "@/constants/links";
import { getAllCategoriesFlat, getSitemapProducts } from "@brand/shared/lib/api";

const staticPages = [
  "/",
  "/o-nama",
  "/kontakt",
  "/gde-kupiti",
  "/katalozi",
  "/proizvodi",
  "/proizvodi/kategorije",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const lastModified = new Date();

  // Static pages
  for (const path of staticPages) {
    entries.push({
      url: `${SITE_URL}${path}`,
      lastModified,
    });
  }

  // All or nothing. This route is ISR, revalidated daily, so a list that lost a
  // source to a backend blip would be served until the next day; a throw keeps
  // the last complete sitemap and the regeneration is retried. At build a throw
  // fails the build, like any prerender that cannot read PACMS.
  const [categories, products] = await Promise.all([
    getAllCategoriesFlat(),
    getSitemapProducts(),
  ]);

  for (const category of categories) {
    entries.push({
      url: `${SITE_URL}/proizvodi/kategorije/${category.slug}`,
      lastModified,
    });
  }

  for (const entry of products) {
    entries.push({
      url: `${SITE_URL}/proizvodi/${entry.slug}`,
      lastModified: new Date(entry.modifiedAt),
    });
  }

  return entries;
}
