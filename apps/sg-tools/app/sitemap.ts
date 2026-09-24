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

  const [categoriesResult, productsResult] = await Promise.allSettled([
    getAllCategoriesFlat(),
    getSitemapProducts(),
  ]);

  if (categoriesResult.status === "fulfilled") {
    for (const category of categoriesResult.value) {
      entries.push({
        url: `${SITE_URL}/proizvodi/kategorije/${category.slug}`,
        lastModified,
      });
    }
  }

  if (productsResult.status === "fulfilled") {
    for (const entry of productsResult.value) {
      entries.push({
        url: `${SITE_URL}/proizvodi/${entry.slug}`,
        lastModified: new Date(entry.modifiedAt),
      });
    }
  }

  return entries;
}
