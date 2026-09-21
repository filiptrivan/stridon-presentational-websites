import { describe, expect, it } from "vitest";

import { groupSeparatorFor, parseStatValue } from "../src/lib/stat-value";

// The stats band counts up to a number it has to recover from an already
// formatted string. That is fine in one language and wrong in two, so the
// cases below pin both spellings of the same figure.
describe("groupSeparatorFor", () => {
  it("knows how each locale groups thousands", () => {
    expect(groupSeparatorFor("sr-RS")).toBe(".");
    expect(groupSeparatorFor("sr")).toBe(".");
    expect(groupSeparatorFor("en")).toBe(",");
  });
});

describe("parseStatValue", () => {
  it("reads a grouped figure and keeps its suffix", () => {
    expect(parseStatValue("10.630+", ".")).toEqual({
      target: 10630,
      suffix: "+",
      grouped: true,
    });
  });

  it("reads the same figure written for English", () => {
    // The regression this file exists for: with a dot-only parser this came
    // back as 10 with ",630+" as the suffix, so the counter finished at once.
    expect(parseStatValue("10,630+", ",")).toEqual({
      target: 10630,
      suffix: "+",
      grouped: true,
    });
  });

  it("does not group a figure that was not written grouped", () => {
    // "1995" is dck's founding year, not a quantity.
    expect(parseStatValue("1995", ".")).toEqual({
      target: 1995,
      suffix: "",
      grouped: false,
    });
    expect(parseStatValue("10630+", ".")).toMatchObject({
      target: 10630,
      grouped: false,
    });
  });

  it("keeps a non-numeric suffix intact", () => {
    expect(parseStatValue("350.000", ".")).toEqual({
      target: 350000,
      suffix: "",
      grouped: true,
    });
    expect(parseStatValue("100+", ",")).toEqual({
      target: 100,
      suffix: "+",
      grouped: false,
    });
  });

  it("leaves the other locale's separator in the suffix rather than guessing", () => {
    // A mismatch has to be visible, not silently half-parsed into a plausible
    // wrong number.
    expect(parseStatValue("10,630+", ".")).toEqual({
      target: 10,
      suffix: ",630+",
      grouped: false,
    });
  });

  it("returns null for a value that does not start with a digit", () => {
    expect(parseStatValue("N/A", ".")).toBeNull();
    expect(parseStatValue("", ".")).toBeNull();
  });
});
