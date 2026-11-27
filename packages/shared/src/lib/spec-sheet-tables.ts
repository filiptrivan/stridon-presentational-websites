import type { SpecRow } from "@brand/shared/types/products";

export type SpecSheetRow = Pick<SpecRow, "label" | "value">;

/** One table of the spec sheet, under its heading when it has one. */
export type SpecSheetTable = { heading?: string; rows: SpecSheetRow[] };

/**
 * The most rows a sheet that is no kit shows as one table. Past it, Baymard's
 * "Spec sheet scannability" (2018-03-27) found shoppers lost in a flat list.
 * At or under it, a heading per section would outnumber the facts. The store's
 * product page uses the same number (pa-storefront `spec-sheet-tables.ts`).
 */
const FLAT_SHEET_MAX_ROWS = 20;

/** The heading over a kit's rows about the whole kit. */
const WHOLE_KIT_HEADING = "Set";

/**
 * The Specifikacija's tables from the product read's `specRows`, which arrive
 * in the page's order. This is the store's own rule:
 * - no kit, 20 rows or fewer: one table, no heading;
 * - no kit, past 20 rows: one table per section, under its name, in the read's order;
 * - a kit (any row with a `member`): one table per member at any length, the
 *   rows about the whole kit first, under "Set".
 * No row gives no table.
 *
 * One difference from the store, on purpose: "Set" always comes first, as
 * pacms-workspace#2545 asks, where the store keeps it wherever the read's
 * first whole-kit row falls. The read's order (`SpecRowPageOrder`) already
 * puts it first, so both pages read the same today.
 */
export function specSheetTables(rows: SpecRow[]): SpecSheetTable[] {
  if (rows.length === 0) return [];
  const isKit = rows.some((row) => row.member);
  if (!isKit && rows.length <= FLAT_SHEET_MAX_ROWS)
    return [{ rows: rows.map(({ label, value }) => ({ label, value })) }];

  const tables = new Map<string, SpecSheetRow[]>();
  // "Set" first, whatever the read's order.
  if (isKit && rows.some((row) => !row.member)) tables.set(WHOLE_KIT_HEADING, []);
  for (const row of rows) {
    const heading = isKit ? (row.member ?? WHOLE_KIT_HEADING) : row.section;
    const label = row.member ? withoutMember(row.label, row.member) : row.label;
    tables.set(heading, [...(tables.get(heading) ?? []), { label, value: row.value }]);
  }
  return [...tables].map(([heading, tableRows]) => ({ heading, rows: tableRows }));
}

/**
 * A kit row's label without its member's article, which the table's heading
 * already says ("GKS 18V-51, broj obrtaja" under "GKS 18V-51" reads "Broj
 * obrtaja"). The article's words may differ from the label's ("4.0Ah" for
 * "4,0Ah", "Punjač GAL 18V-40" in "Brzi punjač GAL 18V-40"), so the opening
 * before the first ", " goes when each of its words is a word of the article.
 * Same rule as the store's (pa-storefront `spec-sheet-tables.ts`).
 */
function withoutMember(label: string, member: string): string {
  const separator = label.indexOf(", ");
  if (separator <= 0) return label;
  const rest = label.slice(separator + 2).trim();
  const memberWords = new Set(wordsOf(member));
  if (!rest || !wordsOf(label.slice(0, separator)).every((word) => memberWords.has(word)))
    return label;
  return rest.charAt(0).toUpperCase() + rest.slice(1);
}

/** Lower-cased, a decimal point read as the store's comma ("4.0Ah" is "4,0ah"). */
function wordsOf(text: string): string[] {
  return text.toLowerCase().replaceAll(".", ",").split(/\s+/).filter(Boolean);
}
