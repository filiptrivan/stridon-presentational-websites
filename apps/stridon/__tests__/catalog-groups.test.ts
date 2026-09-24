import { describe, expect, it } from "vitest";

import {
  UNTAGGED_GROUP_SLUG,
  groupCatalogsByBrand,
} from "@/lib/catalog-groups";
import type { Catalog, CatalogsResult } from "@brand/shared/types/catalogs";

/**
 * Ordering on `/katalozi` follows the brands' PACMS `orderNumber`, then id, the
 * same rule as `/brendovi` (`lib/brand-order.ts`). It is pinned here because the
 * `/Catalogs` response does not deliver it: its brand stubs arrive ordered by
 * `orderNumber` but not by id within a tie (stanley 88 before bosch 13).
 */

type CatalogBrand = Catalog["brands"][number];

const brand = (
  slug: string,
  name: string,
  orderNumber: number | null = 1,
  id = slug.length,
): CatalogBrand => ({ id, name, slug, orderNumber });

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

  it("orders groups by orderNumber, not by the order the API replied", () => {
    const wera = catalog("Wera katalog", [brand("wera", "Wera", 11)]);
    const dewalt = catalog("DeWALT katalog", [brand("dewalt", "DeWalt", 3)]);

    const groups = groupCatalogsByBrand(result([wera, dewalt]));

    expect(groups.map((group) => group.slug)).toEqual(["dewalt", "wera"]);
  });

  it("breaks an orderNumber tie by id", () => {
    // The live /Catalogs order for the three brands PACMS gives `3`.
    const stanley = catalog("Stanley katalog", [
      brand("stanley", "Stanley", 3, 88),
    ]);
    const bosch = catalog("Bosch katalog", [brand("bosch", "Bosch", 3, 13)]);
    const dewalt = catalog("DeWALT katalog", [
      brand("dewalt", "DeWalt", 3, 49),
    ]);

    const groups = groupCatalogsByBrand(result([stanley, bosch, dewalt]));

    expect(groups.map((group) => group.slug)).toEqual([
      "bosch",
      "dewalt",
      "stanley",
    ]);
  });

  it("links a brand the site shows to its page and carries the CMS logo", () => {
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

  it("puts a brand without an orderNumber after the ordered ones, unlinked", () => {
    // The site shows only brands with an orderNumber, so one without keeps its
    // catalogs but has no page to link to.
    const topex = catalog("Topex katalog", [brand("topex", "Topex", null)]);
    const gross = catalog("Gross katalog", [brand("gross", "Gross", 14)]);

    const groups = groupCatalogsByBrand(result([topex, gross]));

    expect(groups.map((group) => group.slug)).toEqual(["gross", "topex"]);
    expect(groups[0].href).toBe("/brendovi/gross");
    expect(groups[1].href).toBeNull();
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
