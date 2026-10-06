import { describe, expect, it } from "vitest";
import { PRODUCTS_PER_PAGE } from "../src/lib/cache-tags";
import { parsePageParam } from "../src/lib/utils";

// PACMS takes the offset as an int32 `first`: past it the read is a 400 and the
// listing a 500.
describe("parsePageParam", () => {
  it("keeps every offset inside PACMS's int32 and leaves real pages alone", () => {
    const offset = (parsePageParam("9".repeat(30)) - 1) * PRODUCTS_PER_PAGE;
    expect(offset).toBeLessThanOrEqual(2 ** 31 - 1);
    expect(parsePageParam("27")).toBe(27);
  });
});
