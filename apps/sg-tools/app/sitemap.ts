import { catalogSitemap } from "@brand/shared/lib/sitemap";

export default function sitemap() {
  return catalogSitemap({
    staticPages: [
      "/",
      "/o-nama",
      "/kontakt",
      "/gde-kupiti",
      "/katalozi",
      "/proizvodi",
      "/proizvodi/kategorije",
    ],
    tags: false,
  });
}
