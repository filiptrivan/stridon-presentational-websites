import { describe, expect, it } from "vitest";

import {
  SITE_BRAND_COUNT,
  byOrderNumber,
  pickSiteBrands,
} from "@/lib/brand-order";

// The one rule that decides what /brendovi, the homepage wall, the sitemap and
// the brand routes contain, and in what order.
describe("brand order", () => {
  it("shows the first 25 brands by orderNumber and none without one", () => {
    // 30 ordered brands, listed back to front, plus two with no orderNumber.
    const ordered = Array.from({ length: 30 }, (_, i) => ({
      id: 100 + i,
      orderNumber: i + 1,
    })).toReversed();
    const rows = [{ id: 1, orderNumber: null }, ...ordered, { id: 2 }];

    const picked = pickSiteBrands(rows);

    expect(SITE_BRAND_COUNT).toBe(25);
    expect(picked.map((row) => row.orderNumber)).toEqual(
      Array.from({ length: 25 }, (_, i) => i + 1),
    );
  });

  it("sorts by orderNumber, then id, with unset orderNumbers last", () => {
    const rows = [
      { id: 88, orderNumber: 3 },
      { id: 5, orderNumber: null },
      { id: 13, orderNumber: 3 },
      { id: 280, orderNumber: 1 },
      { id: 2 },
    ];

    expect(rows.toSorted(byOrderNumber).map((row) => row.id)).toEqual([
      280, 13, 88, 2, 5,
    ]);
  });

  it("gives the same order whatever order the rows arrive in", () => {
    const rows = [
      { id: 49, orderNumber: 3 },
      { id: 13, orderNumber: 3 },
      { id: 88, orderNumber: 3 },
      { id: 7, orderNumber: 1 },
    ];

    const expected = [7, 13, 49, 88];
    expect(rows.toSorted(byOrderNumber).map((row) => row.id)).toEqual(expected);
    expect(
      rows.toReversed().toSorted(byOrderNumber).map((row) => row.id),
    ).toEqual(expected);
  });
});
