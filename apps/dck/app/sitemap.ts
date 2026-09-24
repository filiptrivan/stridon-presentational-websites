import type { MetadataRoute } from "next";

import { SITE_URL } from "@/constants/links";
import {
  getAllCategoriesFlat,
  getSitemapProducts,
  getSitemapTags,
} from "@brand/shared/lib/api";

const staticPages = [
  "/",
  "/o-nama",
  "/kontakt",
  "/gde-kupiti",
  "/katalozi",
  "/produzetak-garancije",
  "/servis",
  "/proizvodi",
  "/proizvodi/kategorije",
  "/proizvodi/tagovi",
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

  const [categoriesResult, productsResult, tagsResult] =
    await Promise.allSettled([
      getAllCategoriesFlat(),
      getSitemapProducts(),
      getSitemapTags(),
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

  if (tagsResult.status === "fulfilled") {
    for (const entry of tagsResult.value) {
      entries.push({
        url: `${SITE_URL}/proizvodi/tagovi/${entry.slug}`,
        lastModified: new Date(entry.modifiedAt),
      });
    }
  }

  return entries;
}
