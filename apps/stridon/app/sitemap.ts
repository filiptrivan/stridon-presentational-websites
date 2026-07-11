import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/links";
import { BRANDS } from "@/constants/brands";

const staticPages = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1.0 },
  { path: "/o-nama", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/brendovi", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/katalozi", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/servis", changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "/b2b", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/kontakt", changeFrequency: "monthly" as const, priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    entries.push({
      url: `${SITE_URL}${page.path}`,
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  }

  for (const brand of BRANDS) {
    entries.push({
      url: `${SITE_URL}/brendovi/${brand.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return entries;
}
