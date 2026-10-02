import { describe, expect, it, vi } from "vitest";

// The sitemap is ISR: a throw keeps the last complete one, while a partial list
// would be served for a day. So one failing source must fail the regeneration.
vi.mock("@brand/shared/lib/api", () => ({
  getAllCategoriesFlat: vi.fn().mockResolvedValue([]),
  getSitemapProducts: vi.fn().mockRejectedValue(new Error("API error: 524")),
  getSitemapTags: vi.fn().mockResolvedValue([]),
}));

const { default: sitemap } = await import("../app/sitemap");

describe("sitemap", () => {
  it("fails rather than publish a list missing a source", async () => {
    await expect(sitemap()).rejects.toThrow("524");
  });
});
