import { getBrandConfig } from "@brand/config";
import type { MetadataRoute } from "next";

import {
  getAllCategoriesFlat,
  getSitemapProducts,
  getSitemapTags,
} from "./api";

/**
 * The dck and sg-tools sitemap: the static pages, every category and product,
 * and every tag on a site that has tag pages.
 */
export async function catalogSitemap({
  staticPages,
  tags,
}: {
  staticPages: readonly string[];
  tags: boolean;
}): Promise<MetadataRoute.Sitemap> {
  const { siteUrl } = getBrandConfig();
  const lastModified = new Date();

  // All or nothing. This route is ISR, revalidated daily, so a list that lost a
  // source to a backend blip would be served until the next day; a throw keeps
  // the last complete sitemap and the regeneration is retried. At build a throw
  // fails the build, like any prerender that cannot read PACMS.
  const [categories, products, tagEntries] = await Promise.all([
    getAllCategoriesFlat(),
    getSitemapProducts(),
    tags ? getSitemapTags() : [],
  ]);

  return [
    ...staticPages.map((path) => ({ url: `${siteUrl}${path}`, lastModified })),
    ...categories.map(({ slug }) => ({
      url: `${siteUrl}/proizvodi/kategorije/${slug}`,
      lastModified,
    })),
    ...products.map(({ slug, modifiedAt }) => ({
      url: `${siteUrl}/proizvodi/${slug}`,
      lastModified: new Date(modifiedAt),
    })),
    ...tagEntries.map(({ slug, modifiedAt }) => ({
      url: `${siteUrl}/proizvodi/tagovi/${slug}`,
      lastModified: new Date(modifiedAt),
    })),
  ];
}
