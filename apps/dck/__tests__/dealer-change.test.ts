import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { DEALERS as DCK_DEALERS } from "@/constants/dealers";

import { DEALERS as SG_DEALERS } from "../../sg-tools/constants/dealers";
import {
  classifyChange,
  entriesOf,
  parseDealers,
} from "../../../.claude/skills/add-dealer/scripts/lib/dealers-io.mjs";

/**
 * `classifyChange` decides which dealer PRs merge with nobody reviewing them: the required
 * dealer-change check (.github/workflows/dealer-change.yml) passes an `expected` change and
 * auto-merge takes it from there. `owner` fails the check until @filiptrivan approves; `none` and
 * `mixed` pass it, and CODEOWNERS (`*`) makes him review those PRs instead.
 *
 * The lists below are written out by hand rather than with the skill's writer, so a change to the
 * writer cannot make its own output look expected. Each has 7 non-service dealers: a new one at
 * the end never reaches the 6 shown on product pages, as on the real sites.
 */

const DCK = "apps/dck/constants/dealers.ts";
const SG = "apps/sg-tools/constants/dealers.ts";

interface Entry {
  id: string;
  category?: "dealer" | "online" | "service";
  address?: string;
  phone?: string;
  lat?: number;
}

const block = ({ id, category = "dealer", address = "Glavna 1", phone, lat = 44.8 }: Entry) =>
  [
    "  {",
    `    id: "${id}",`,
    `    name: "${id}",`,
    `    address: "${address}",`,
    `    city: "Beograd",`,
    ...(phone ? [`    phone: "${phone}",`] : []),
    `    category: "${category}",`,
    `    coordinates: { lat: ${lat}, lng: 20.4 },`,
    "  },",
  ].join("\n");

const BASE: Entry[] = [
  { id: "web-1", category: "online" },
  { id: "web-2", category: "online" },
  ...[1, 2, 3, 4, 5].map((n) => ({ id: `shop-${n}`, lat: 44.8 + n / 100 })),
];

const fileText = (entries: Entry[], spread?: string, after = "") =>
  [
    'import type { Dealer } from "@brand/shared/types/dealers";',
    "",
    "export const DEALERS: Dealer[] = [",
    ...entries.map(block),
    ...(spread ? [`  ...${spread},`] : []),
    "];",
    after,
  ].join("\n");

// dck spreads its service centres at the end of the list; sg-tools has none.
const dck = (entries: Entry[], after?: string) =>
  parseDealers(fileText(entries, "SERVICE_DEALERS", after));
const sg = (entries: Entry[], after?: string) => parseDealers(fileText(entries, undefined, after));
const both = (entries: Entry[], after?: string) => ({
  dck: dck(entries, after),
  "sg-tools": sg(entries, after),
});
const moved = (id: string, change: Partial<Entry>) =>
  BASE.map((entry) => (entry.id === id ? { ...entry, ...change } : entry));

const NEW: Entry = { id: "new-shop", address: "Nova 7", lat: 44.9 };
const NEW_ONLINE: Entry = { id: "new-web", category: "online", lat: 44.9 };
const CODE = 'console.log("runs at build time");';

const base = both(BASE);

describe("classifyChange", () => {
  it.each([
    {
      name: "an add on one site",
      head: { dck: dck([...BASE, NEW]) },
      files: [DCK],
      kind: "expected",
    },
    {
      name: "an add on both sites with different data",
      head: { dck: dck([...BASE, NEW]), "sg-tools": sg([...BASE, { ...NEW, phone: "011/999-9999" }]) },
      files: [DCK, SG],
      kind: "owner",
    },
    {
      name: "an add plus extra code in the same file",
      head: { dck: dck([...BASE, NEW], CODE) },
      files: [DCK],
      kind: "owner",
    },
    {
      name: "an add plus another file",
      head: { dck: dck([...BASE, NEW]) },
      files: [DCK, "apps/dck/app/page.tsx"],
      kind: "mixed",
    },
    {
      name: "a move on both sites",
      head: both(moved("shop-5", { address: "Nova 9", lat: 44.9 })),
      files: [DCK, SG],
      kind: "expected",
    },
    {
      name: "a new online dealer at the end of the list",
      head: both([...BASE, NEW_ONLINE]),
      files: [DCK, SG],
      kind: "expected",
    },
    {
      name: "any other file changed",
      head: {},
      files: ["package.json"],
      kind: "none",
    },
    {
      name: "a new online dealer plus code outside the list",
      head: both([...BASE, NEW_ONLINE], CODE),
      files: [DCK, SG],
      kind: "owner",
    },
    {
      name: "a service centre added to the list",
      head: { dck: dck([...BASE, { ...NEW, category: "service" }]) },
      files: [DCK],
      kind: "owner",
    },
    {
      name: "a move of one of the first 6",
      head: both(moved("shop-1", { address: "Nova 9" })),
      files: [DCK, SG],
      kind: "owner",
    },
    {
      name: "a new dealer with a service centre's id",
      head: { dck: dck([...BASE, { ...NEW, id: "service-1" }]) },
      files: [DCK],
      reserved: { dck: ["service-1"] },
      kind: "invalid",
    },
  ])("$name: $kind", ({ head, files, reserved, kind }) => {
    const result = classifyChange(base, { ...base, ...head }, files, reserved);
    expect(result.kind, JSON.stringify(result.reasons ?? result.errors)).toBe(kind);
    expect(result.ok).toBe(kind !== "owner" && kind !== "invalid");
  });
});

/**
 * The skill and the check read the dealer files as text, never by importing them, so this keeps
 * the parser honest against what the sites actually import.
 */
describe("dealer lists", () => {
  const REPO_ROOT = resolve(__dirname, "../../..");
  const withoutComments = (entry: Record<string, unknown>) =>
    Object.fromEntries(Object.entries(entry).filter(([key]) => key !== "comments"));

  it.each([
    { site: "dck", file: DCK, imported: DCK_DEALERS },
    { site: "sg-tools", file: SG, imported: SG_DEALERS },
  ])("$site: the parser reads what the site imports", ({ file, imported }) => {
    const parsed = parseDealers(readFileSync(resolve(REPO_ROOT, file), "utf8"));
    expect(parsed.errors).toEqual([]);
    expect(entriesOf(parsed).map(withoutComments)).toEqual(
      imported.filter((dealer) => dealer.category !== "service"),
    );
  });
});
