import { describe, expect, it } from "vitest";

import { BRAND_SLUGS } from "@/constants/brands";
import {
  UNTAGGED_GROUP_SLUG,
  groupCatalogsByBrand,
} from "@/lib/catalog-groups";
import type { Catalog, CatalogsResult } from "@brand/shared/types/catalogs";

/**
 * Ordering on `/katalozi` is a product decision, not an artifact of however
 * PACMS returned the rows, so it is pinned here rather than left to a reviewer
 * to eyeball. The backend's own `orderNumber` is not usable as a sort key: it
 * hands out duplicates (stanley, bosch and dewalt are all `3`).
 */

type CatalogBrand = Catalog["brands"][number];

const brand = (
  slug: string,
  name: string,
  orderNumber = 1,
): CatalogBrand => ({ id: slug.length, name, slug, orderNumber });

let nextId = 0;
const catalog = (name: string, brands: CatalogBrand[]): Catalog => ({
  id: ++nextId,
  name,
  previewImageUrl: `https://media.example.com/${name}.png`,
  fileUrl: `https://media.example.com/${name}.pdf`,
  brands,
});

const result = (catalogs: Catalog[]): CatalogsResult => ({
  catalogs,
  brands: [
    ...new Map(
      catalogs.flatMap((c) => c.brands).map((b) => [b.slug, b]),
    ).values(),
  ],
});

describe("groupCatalogsByBrand", () => {
  it("returns nothing for an empty catalogue", () => {
    expect(groupCatalogsByBrand(result([]))).toEqual([]);
  });

  it("orders listed brands the way BRAND_SLUGS does, not the way the API replied", () => {
    // Reversed on purpose: wera sits after dewalt in BRAND_SLUGS, so input order
    // must not survive.
    const wera = catalog("Wera katalog", [brand("wera", "Wera", 11)]);
    const dewalt = catalog("DeWALT katalog", [brand("dewalt", "DeWalt", 3)]);

    const groups = groupCatalogsByBrand(result([wera, dewalt]));

    expect(groups.map((group) => group.slug)).toEqual(["dewalt", "wera"]);
    const order = [...BRAND_SLUGS];
    expect(order.indexOf("dewalt")).toBeLessThan(order.indexOf("wera"));
  });

  it("links a listed brand to its page and carries the CMS logo", () => {
    const groups = groupCatalogsByBrand(
      result([
        catalog("Hogert katalog", [
          brand("hogert-technik", "HÖGERT Technik", 6),
        ]),
      ]),
      {
        logoBySlug: new Map([
          ["hogert-technik", "https://media.example.com/hogert.png"],
        ]),
      },
    );

    expect(groups).toHaveLength(1);
    expect(groups[0]).toMatchObject({
      slug: "hogert-technik",
      name: "HÖGERT Technik",
      href: "/brendovi/hogert-technik",
      imageUrl: "https://media.example.com/hogert.png",
    });
  });

  it("leaves imageUrl null when the CMS has no logo for the brand", () => {
    const groups = groupCatalogsByBrand(
      result([catalog("Wera katalog", [brand("wera", "Wera", 11)])]),
    );

    expect(groups[0].imageUrl).toBeNull();
  });

  it("puts brands we do not list after the listed ones, by name", () => {
    // Neither is in BRAND_SLUGS, so both are unlinked and sorted by name.
    const topex = catalog("Topex katalog", [brand("topex", "Topex", 20)]);
    const gross = catalog("Gross katalog", [brand("gross", "Gross", 14)]);
    const bosch = catalog("Bosch katalog", [brand("bosch", "Bosch", 3)]);

    const groups = groupCatalogsByBrand(result([topex, gross, bosch]));

    expect(groups.map((group) => group.slug)).toEqual([
      "bosch",
      "gross",
      "topex",
    ]);
    expect(groups[0].href).toBe("/brendovi/bosch");
    expect(groups[1].href).toBeNull();
    expect(groups[2].href).toBeNull();
  });

  it("collects untagged catalogs into a trailing group", () => {
    const tagged = catalog("REMS akcija 2025.", [brand("rems", "REMS", 18)]);
    const untagged = catalog("REMS akcija 2026.", []);

    const groups = groupCatalogsByBrand(result([untagged, tagged]));

    expect(groups.map((group) => group.slug)).toEqual([
      "rems",
      UNTAGGED_GROUP_SLUG,
    ]);
    expect(groups[1].catalogs).toEqual([untagged]);
    expect(groups[1].href).toBeNull();
  });

  it("lists a catalog under every brand it carries", () => {
    // No catalog does this today, but StorefrontCatalogDTO allows it, and the
    // failure mode of picking the first brand is a catalog that silently
    // disappears from a page it belongs on.
    const shared = catalog("MTX i Sparta katalog", [
      brand("mtx", "MTX", 9),
      brand("sparta", "Sparta", 13),
    ]);

    const groups = groupCatalogsByBrand(result([shared]));

    expect(groups.map((group) => group.slug)).toEqual(["mtx", "sparta"]);
    expect(groups[0].catalogs).toEqual([shared]);
    expect(groups[1].catalogs).toEqual([shared]);
  });

  it("keeps a brand's catalogs in the order the API returned them", () => {
    const first = catalog("Wiha katalog", [brand("wiha", "Wiha", 10)]);
    const second = catalog("Wiha merni alati", [brand("wiha", "Wiha", 10)]);

    const groups = groupCatalogsByBrand(result([first, second]));

    expect(groups[0].catalogs).toEqual([first, second]);
  });
  it("takes the brand route and the untagged heading from the caller", () => {
    // Both are locale-dependent, so neither can be decided in here: /brendovi
    // is /en/brands in English, and the heading is a translated string.
    const groups = groupCatalogsByBrand(
      result([
        catalog("Wera katalog", [brand("wera", "Wera", 11)]),
        catalog("REMS akcija", []),
      ]),
      {
        brandHref: (slug) => `/en/brands/${slug}`,
        untaggedName: "Other catalogs",
      },
    );

    expect(groups[0].href).toBe("/en/brands/wera");
    expect(groups.at(-1)).toMatchObject({
      slug: UNTAGGED_GROUP_SLUG,
      name: "Other catalogs",
      href: null,
    });
  });
});
