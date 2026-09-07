import type { MetadataRoute } from "next";

import { BRANDS } from "@/constants/brands";
import { SITE_URL } from "@/constants/links";

// Stridon has no product routes (it is the distributor site, purchases happen
// on prodavnicaalata.rs), so this is a static list - no API reads at build.
const staticPages = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1.0 },
  { path: "/brendovi", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/katalozi", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/servis", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/o-nama", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/b2b", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/kontakt", changeFrequency: "monthly" as const, priority: 0.6 },
  {
    path: "/politika-privatnosti",
    changeFrequency: "yearly" as const,
    priority: 0.3,
  },
  {
    path: "/uslovi-koriscenja",
    changeFrequency: "yearly" as const,
    priority: 0.3,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    ...staticPages.map((page) => ({
      url: `${SITE_URL}${page.path}`,
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...BRANDS.map((brand) => ({
      url: `${SITE_URL}/brendovi/${brand.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
