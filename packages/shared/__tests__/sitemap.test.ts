import { describe, expect, it, vi } from "vitest";

vi.mock("../src/lib/api", () => ({
  getAllCategoriesFlat: vi.fn().mockResolvedValue([{ slug: "kutije-za-alat" }]),
  getSitemapProducts: vi
    .fn()
    .mockResolvedValue([{ slug: "dck-58", modifiedAt: "2026-10-01T00:00:00Z" }]),
  getSitemapTags: vi
    .fn()
    .mockResolvedValue([{ slug: "akcija", modifiedAt: "2026-10-01T00:00:00Z" }]),
}));
vi.stubEnv("NEXT_PUBLIC_BRAND_SLUG", "dck");

const { getSitemapProducts, getSitemapTags } = await import("../src/lib/api");
const { catalogSitemap } = await import("../src/lib/sitemap");

const urls = async (tags: boolean) =>
  (await catalogSitemap({ staticPages: ["/"], tags })).map((entry) => entry.url);

describe("catalogSitemap", () => {
  it("lists static pages, categories, products and, on a site with tag pages, tags", async () => {
    expect(await urls(true)).toEqual([
      "https://www.dcksrbija.rs/",
      "https://www.dcksrbija.rs/proizvodi/kategorije/kutije-za-alat",
      "https://www.dcksrbija.rs/proizvodi/dck-58",
      "https://www.dcksrbija.rs/proizvodi/tagovi/akcija",
    ]);
    vi.mocked(getSitemapTags).mockClear();
    expect(await urls(false)).toHaveLength(3);
    expect(getSitemapTags).not.toHaveBeenCalled();
  });

  // The sitemap is ISR: a throw keeps the last complete one, while a partial list
  // would be served for a day. So one failing source must fail the regeneration.
  it("fails rather than publish a list missing a source", async () => {
    vi.mocked(getSitemapProducts).mockRejectedValueOnce(new Error("API error: 524"));
    await expect(urls(true)).rejects.toThrow("524");
  });
});
