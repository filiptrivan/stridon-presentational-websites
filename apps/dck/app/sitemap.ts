import { catalogSitemap } from "@brand/shared/lib/sitemap";

export default function sitemap() {
  return catalogSitemap({
    staticPages: [
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
    ],
    tags: true,
  });
}
