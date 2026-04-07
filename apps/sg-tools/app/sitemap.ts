import type { MetadataRoute } from "next";

import { SITE_URL } from "@/constants/links";
import { getLeafCategories, getSitemapProducts } from "@brand/shared/lib/api";

const staticPages = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1.0 },
  { path: "/o-nama", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/kontakt", changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "/gde-kupiti", changeFrequency: "monthly" as const, priority: 0.7 },
  {
    path: "/proizvodi",
    changeFrequency: "weekly" as const,
    priority: 0.9,
  },
  {
    path: "/proizvodi/kategorije",
    changeFrequency: "weekly" as const,
    priority: 0.9,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const lastModified = new Date();

  // Static pages
  for (const page of staticPages) {
    entries.push({
      url: `${SITE_URL}${page.path}`,
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  }

  const [categoriesResult, productsResult] = await Promise.allSettled([
    getLeafCategories(),
    getSitemapProducts(),
  ]);

  if (categoriesResult.status === "fulfilled") {
    for (const category of categoriesResult.value) {
      entries.push({
        url: `${SITE_URL}/proizvodi/kategorije/${category.slug}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  if (productsResult.status === "fulfilled") {
    for (const entry of productsResult.value) {
      entries.push({
        url: `${SITE_URL}/proizvodi/${entry.slug}`,
        lastModified: new Date(entry.modifiedAt),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
