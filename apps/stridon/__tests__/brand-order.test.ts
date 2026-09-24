import { describe, expect, it } from "vitest";

import { byOrderNumber, isSiteBrand } from "@/lib/brand-order";

// The one rule that decides what /brendovi, the homepage wall, the sitemap and
// the brand routes contain, and in what order.
describe("brand order", () => {
  it("shows exactly the brands that have an orderNumber", () => {
    expect(isSiteBrand({ id: 1, orderNumber: 1 })).toBe(true);
    expect(isSiteBrand({ id: 2, orderNumber: null })).toBe(false);
    expect(isSiteBrand({ id: 3 })).toBe(false);
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
