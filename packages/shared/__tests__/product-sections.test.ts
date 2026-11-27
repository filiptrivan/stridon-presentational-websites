import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ProductSections from "../src/components/products/product-sections";
import type { SpecRow } from "../src/types/products";

// The dck and sg-tools product page's "Specifikacija", drawn from the read's
// `specRows` by the store's own rule (pa-storefront `spec-sheet-tables.ts`).
// Against static markup, since every claim is about the served HTML.

const row = (overrides: Partial<SpecRow> = {}): SpecRow => ({
  label: "Težina",
  value: "2 kg",
  section: "Dimenzije i težina",
  member: null,
  ...overrides,
});

const render = (specRows: SpecRow[], htmlDescription: string | null = null) =>
  renderToStaticMarkup(
    createElement(ProductSections, { htmlDescription, specRows }),
  );

/** The table headings (h3), in order. */
const headings = (html: string) =>
  [...html.matchAll(/<h3[^>]*>([^<]*)<\/h3>/g)].map((match) => match[1]);

/** Each table's rows as "label: value". */
const tables = (html: string) =>
  [...html.matchAll(/<table[^>]*>(.*?)<\/table>/g)].map((table) =>
    [...table[1].matchAll(/<th[^>]*>([^<]*)<\/th><td[^>]*>([^<]*)<\/td>/g)].map(
      (cells) => `${cells[1]}: ${cells[2]}`,
    ),
  );

/** `count` rows that alternate between two sections, so a split is visible. */
const rows = (count: number) =>
  Array.from({ length: count }, (_, index) =>
    row({
      label: `Red ${index + 1}`,
      value: `${index + 1}`,
      section: index < count / 2 ? "Snaga i brzina" : "Dimenzije i težina",
    }),
  );

describe("the Specifikacija section", () => {
  it("draws one row as one table with no heading", () => {
    const html = render([row()]);

    expect(html).toContain(">Specifikacija</h2>");
    expect(headings(html)).toEqual([]);
    expect(tables(html)).toEqual([["Težina: 2 kg"]]);
  });

  it("draws 20 rows as one table with no heading", () => {
    const html = render(rows(20));

    expect(headings(html)).toEqual([]);
    expect(tables(html)).toHaveLength(1);
    expect(tables(html)[0]).toHaveLength(20);
  });

  it("draws 21 rows as one table per section, in the read's order", () => {
    const html = render(rows(21));

    expect(headings(html)).toEqual(["Snaga i brzina", "Dimenzije i težina"]);
    expect(tables(html).map((table) => table.length)).toEqual([11, 10]);
  });

  it("draws a kit as 'Set' first, then one table per member, the article dropped from its labels", () => {
    const html = render([
      row({ label: "GKS 18V-51, broj obrtaja", value: "5.000 o/min", member: "GKS 18V-51" }),
      row({ label: "Težina seta", value: "6 kg" }),
      row({ label: "Punjač GAL 18V-40, struja punjenja", value: "4 A", member: "Brzi punjač GAL 18V-40" }),
      row({ label: "Akumulator 4.0Ah, kapacitet", value: "4 Ah", member: "Akumulator 4,0Ah" }),
    ]);

    expect(headings(html)).toEqual(["Set", "GKS 18V-51", "Brzi punjač GAL 18V-40", "Akumulator 4,0Ah"]);
    expect(tables(html)).toEqual([
      ["Težina seta: 6 kg"],
      ["Broj obrtaja: 5.000 o/min"],
      ["Struja punjenja: 4 A"],
      ["Kapacitet: 4 Ah"],
    ]);
  });

  it("keeps a kit label whose opening is not all its member's article", () => {
    const html = render([
      row({ label: "Napon GKS, nominalni", value: "18 V", member: "GKS 18V-51" }),
      row({ label: "GKS 18V-51, ", value: "1 kom", member: "GKS 18V-51" }),
    ]);

    expect(tables(html)).toEqual([["Napon GKS, nominalni: 18 V", "GKS 18V-51, : 1 kom"]]);
  });

  it("shows no Specifikacija section for a product with no row", () => {
    const html = render([], "<p>Opis</p>");

    expect(html).toContain(">Detalji</h2>");
    expect(html).not.toContain("Specifikacija");
    expect(html).not.toContain("<table");
  });

  it("renders nothing for a product with no row and no description", () => {
    expect(render([])).toBe("");
  });
});
