import { describe, expect, it } from "vitest";
import en from "../messages/en.json";
import sr from "../messages/sr.json";

// global.ts types every next-intl call against sr.json only, so a key that
// exists in Serbian and is missing in English still compiles and renders as
// the raw key on /en. This holds the English catalog to the same shape.
//
// Arrays are leaves (`t.raw` reads them whole), so only their presence and
// kind are compared, not their length: a paragraph list may be split
// differently in each language.
type Tree = { [key: string]: unknown };

function leaves(tree: Tree, prefix = ""): Map<string, string> {
  const out = new Map<string, string>();
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      for (const [p, kind] of leaves(value as Tree, path)) out.set(p, kind);
    } else {
      out.set(path, Array.isArray(value) ? "array" : typeof value);
    }
  }
  return out;
}

describe("messages", () => {
  const srLeaves = leaves(sr);
  const enLeaves = leaves(en);

  it("has every Serbian key in English", () => {
    const missing = [...srLeaves.keys()].filter((key) => !enLeaves.has(key));
    expect(missing).toEqual([]);
  });

  it("has no English key that Serbian lacks", () => {
    const extra = [...enLeaves.keys()].filter((key) => !srLeaves.has(key));
    expect(extra).toEqual([]);
  });

  it("gives each key the same kind of value in both languages", () => {
    const mismatched = [...srLeaves]
      .filter(([key, kind]) => enLeaves.has(key) && enLeaves.get(key) !== kind)
      .map(([key]) => key);
    expect(mismatched).toEqual([]);
  });
});
