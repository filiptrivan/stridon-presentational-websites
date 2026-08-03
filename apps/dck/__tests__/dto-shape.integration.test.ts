import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import ts from "typescript";
import { describe, expect, it } from "vitest";

/**
 * The backend's own `[Required]` declarations, checked against what it really sends.
 *
 * This started life checking our hand-written interfaces against real responses,
 * because `Tag.imageUrl` was declared `string` here while
 * `StorefrontTagDTO.ImageUrl` had been `string?` on the backend forever. That
 * class of bug is now gone by construction: the types are ALIASED from the
 * generated schema (`packages/shared/src/types/*.ts`), so a transcription error
 * is unrepresentable rather than merely detectable.
 *
 * What generation cannot prove is that the backend obeys its own contract. A DTO
 * marked `[Required] public string ImageUrl` whose projection LEFT JOINs and
 * sends null type-checks perfectly on both sides of the wire and still hands
 * `null` to code the schema promised would never see one. That is what this
 * still checks, and it is the only remaining shape guard worth running.
 *
 * The sibling ledger (api-contract-coverage.test.ts) protects the ROUTES; these
 * calls double as its coverage, which is why five endpoints left its debt list.
 *
 * KNOWN LIMIT: a response can only catch a violation once some row exhibits it.
 * It cannot prove a field is never null. Generation covers the declared
 * contract; this covers the delivered data; neither alone is complete.
 *
 * Scope: top-level fields. Nested shapes (ProductMedia, CategoryBreadcrumb) are
 * the obvious extension, left out to keep the first version readable.
 */

const API_URL = process.env.API_URL || "https://api.pacms.in.rs";
const BRAND = "dck";
const SCHEMA_FILE = resolve(__dirname, "../../../packages/shared/src/types/api.ts");

/** A stable DCK product — same one the warranty integration test registers against. */
const PRODUCT_SLUG =
  "dck-krh20v-28r2k-akumulatorska-busilica-za-beton-sds-plus-sa-2x80ah-baterije-i-punjacem-20v";

// Parsed once: the generated file is ~6,800 lines and immutable for the run.
const schemaSource = ts.createSourceFile(
  SCHEMA_FILE,
  readFileSync(SCHEMA_FILE, "utf8"),
  ts.ScriptTarget.Latest,
  true,
);

/** The type literal of a named member, or undefined — the two nested lookups below are identical. */
function memberLiteral(
  members: readonly ts.TypeElement[] | undefined,
  name: string,
): ts.TypeLiteralNode | undefined {
  const member = members?.find(
    (candidate): candidate is ts.PropertySignature =>
      ts.isPropertySignature(candidate) &&
      ts.isIdentifier(candidate.name) &&
      candidate.name.text === name,
  );
  return member?.type && ts.isTypeLiteralNode(member.type) ? member.type : undefined;
}

/**
 * Fields a generated schema marks as always present and non-null, read out of
 * the generated file itself.
 *
 * openapi-typescript emits a `[Required]` property as `name: T` and everything
 * else as `name?: T | null`, so the question token IS the backend's `[Required]`
 * attribute surviving the round trip. Reading it here rather than hand-listing
 * means a DTO change moves this check with no edit.
 */
function requiredFields(schemaName: string): string[] {
  const components = schemaSource.statements.find(
    (statement): statement is ts.InterfaceDeclaration =>
      ts.isInterfaceDeclaration(statement) && statement.name.text === "components",
  );

  const schema = memberLiteral(
    memberLiteral(components?.members, "schemas")?.members,
    schemaName,
  );

  // Never fall back to an empty list — that would make every assertion below
  // pass vacuously, which is worse than the drift this test exists to catch.
  if (!schema) {
    throw new Error(
      `Schema ${schemaName} not found in ${SCHEMA_FILE}. If the DTO was renamed, update this test.`,
    );
  }

  return schema.members.flatMap((member) =>
    ts.isPropertySignature(member) && !member.questionToken && ts.isIdentifier(member.name)
      ? [member.name.text]
      : [],
  );
}

async function read<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  expect(res.status, `${path} should be readable anonymously`).toBe(200);
  return (await res.json()) as T;
}

/** Flattens the self-recursive subCategories so children are checked too. */
function flattenCategories(
  categories: Record<string, unknown>[],
): Record<string, unknown>[] {
  return categories.flatMap((category) => [
    category,
    ...flattenCategories((category.subCategories as Record<string, unknown>[]) ?? []),
  ]);
}

function assertShape(
  schemaName: string,
  items: Record<string, unknown>[],
  label: string,
) {
  expect(
    items.length,
    `${label} returned nothing — the check would pass vacuously`,
  ).toBeGreaterThan(0);

  const fields = requiredFields(schemaName);
  expect(fields.length, `${schemaName} declared no required fields`).toBeGreaterThan(0);

  // A Set, not an array: 100 items x ~15 fields would push up to 1,500 duplicate
  // strings only to dedupe them, and every row violates the same way.
  const violations = new Set<string>();
  for (const item of items) {
    for (const field of fields) {
      if (!(field in item)) violations.add(`${field}: absent from the response`);
      else if (item[field] === null) violations.add(`${field}: null`);
    }
  }

  expect(
    [...violations].sort(),
    `${schemaName} declares these [Required], but ${label} sends otherwise. Fix the BACKEND — ` +
      `either the projection that produces the null, or the attribute that over-promises. ` +
      `Do not paper over it here; the generated types trust that declaration.`,
  ).toEqual([]);
}

describe("PACMS DTO shape", () => {
  it("StorefrontCategoryDTO matches /api/Storefront/Categories", async () => {
    const categories = await read<Record<string, unknown>[]>(
      `/api/Storefront/Categories?brandSlug=${BRAND}`,
    );
    assertShape("StorefrontCategoryDTO", flattenCategories(categories), "Categories");
  });

  it("StorefrontTagDTO matches /api/Storefront/TagsByBrand", async () => {
    const tags = await read<Record<string, unknown>[]>(
      `/api/Storefront/TagsByBrand?brandSlug=${BRAND}`,
    );
    assertShape("StorefrontTagDTO", tags, "TagsByBrand");
  });

  it("StorefrontCatalogDTO matches /api/Storefront/CatalogsByBrand", async () => {
    const catalogs = await read<Record<string, unknown>[]>(
      `/api/Storefront/CatalogsByBrand?brandSlug=${BRAND}`,
    );
    assertShape("StorefrontCatalogDTO", catalogs, "CatalogsByBrand");
  });

  it("StorefrontProductCardDTO matches /api/Storefront/FilteredProducts", async () => {
    // A wide page on purpose: one card proves almost nothing about a field that
    // is null on 3% of rows, which is the shape of every bug this catches.
    const result = await read<{ data: Record<string, unknown>[] }>(
      "/api/Storefront/FilteredProducts",
      {
        method: "POST",
        body: JSON.stringify({
          brandSlugs: [BRAND],
          tagSlugs: [],
          first: 0,
          rows: 100,
        }),
      },
    );
    assertShape("StorefrontProductCardDTO", result.data, "FilteredProducts");
  });

  it("StorefrontProductDTO matches /api/Storefront/ProductBySlug", async () => {
    const product = await read<Record<string, unknown>>(
      `/api/Storefront/ProductBySlug?slug=${encodeURIComponent(PRODUCT_SLUG)}`,
    );
    assertShape("StorefrontProductDTO", [product], "ProductBySlug");
  });
});
