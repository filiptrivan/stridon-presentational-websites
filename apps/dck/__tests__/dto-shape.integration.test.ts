import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import ts from "typescript";
import { describe, expect, it } from "vitest";

/**
 * Our hand-written PACMS DTOs must match what the backend actually sends.
 *
 * Why this exists: `Tag.imageUrl` was declared `string` here while
 * `StorefrontTagDTO.ImageUrl` has been `string?` on the backend for its whole
 * life. Nothing caught it — TypeScript cannot, because the interface is a
 * *claim* about a JSON payload, not a derivation from it, so a wrong claim
 * compiles perfectly and simply hands `null` to code the types promised would
 * never see one. It surfaced only because a PACMS refactor made someone read
 * both sides of the wire at once. That is not a review process.
 *
 * The sibling ledger (api-contract-coverage.test.ts) protects the *routes* these
 * sites call. This protects the *shapes* they decode — the other half of the
 * same contract, and the half that fails silently rather than loudly.
 *
 * Deliberately NOT done by fetching the OpenAPI schema: it sits behind
 * SwaggerBasicAuthMiddleware together with the ADMIN document, so wiring those
 * credentials into this repo's CI would trade a type bug for a blast-radius
 * problem. Real responses are a weaker oracle (they cannot prove a field is
 * never null, only catch it once some row is) but they need no new secret and
 * they check the thing that actually ships.
 *
 * Scope: top-level fields only. Nested shapes (ProductMedia, CategoryBreadcrumb)
 * are the obvious extension; they were left out to keep the first version
 * readable rather than because they are safe.
 */

const API_URL = process.env.API_URL || "https://api.pacms.in.rs";
const BRAND = "dck";
const TYPES_DIR = resolve(__dirname, "../../../packages/shared/src/types");

/** A stable DCK product — same one the warranty integration test registers against. */
const PRODUCT_SLUG =
  "dck-krh20v-28r2k-akumulatorska-busilica-za-beton-sds-plus-sa-2x80ah-baterije-i-punjacem-20v";

/**
 * Field names an interface declares as ALWAYS PRESENT AND NON-NULL, read out of
 * the declaration itself.
 *
 * Derived rather than hand-listed on purpose: a maintained list would be a
 * second copy of the interface, drifting from it exactly the way the interface
 * drifted from the backend. Adding a field to the type puts it under this check
 * with no edit here; marking one `| null` removes it.
 */
function requiredFields(interfaceName: string): string[] {
  const files = ["products.ts", "categories.ts", "tags.ts", "catalogs.ts"];

  for (const file of files) {
    const path = resolve(TYPES_DIR, file);
    const source = ts.createSourceFile(
      path,
      readFileSync(path, "utf8"),
      ts.ScriptTarget.Latest,
      true,
    );

    for (const statement of source.statements) {
      if (
        !ts.isInterfaceDeclaration(statement) ||
        statement.name.text !== interfaceName
      ) {
        continue;
      }

      // `extends` matters: Product gets most of its surface from ProductCardData,
      // and checking only the extension would silently exempt the inherited half
      // — including imageUrl, the field this whole guard grew out of.
      const inherited = (statement.heritageClauses ?? []).flatMap((clause) =>
        clause.types.flatMap((base) =>
          ts.isIdentifier(base.expression)
            ? requiredFields(base.expression.text)
            : [],
        ),
      );

      const own = statement.members.filter(ts.isPropertySignature).flatMap((member) => {
        if (member.questionToken || !member.type) return [];
        // A union mentioning null/undefined is a declared maybe, not a promise.
        const optional =
          ts.isUnionTypeNode(member.type) &&
          member.type.types.some(
            (part) =>
              part.kind === ts.SyntaxKind.NullKeyword ||
              part.kind === ts.SyntaxKind.UndefinedKeyword ||
              (ts.isLiteralTypeNode(part) &&
                part.literal.kind === ts.SyntaxKind.NullKeyword),
          );
        if (optional) return [];
        return ts.isIdentifier(member.name) ? [member.name.text] : [];
      });

      return [...new Set([...inherited, ...own])];
    }
  }

  throw new Error(
    `Interface ${interfaceName} not found in ${TYPES_DIR}. If it moved, update this test — ` +
      `a silently-empty field list would make every assertion below pass vacuously.`,
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

/** Flattens Category's self-recursive subCategories so children are checked too. */
function flattenCategories(
  categories: Record<string, unknown>[],
): Record<string, unknown>[] {
  return categories.flatMap((category) => [
    category,
    ...flattenCategories(
      (category.subCategories as Record<string, unknown>[]) ?? [],
    ),
  ]);
}

function assertShape(
  interfaceName: string,
  items: Record<string, unknown>[],
  label: string,
) {
  expect(items.length, `${label} returned nothing — the check would pass vacuously`)
    .toBeGreaterThan(0);

  const fields = requiredFields(interfaceName);
  expect(fields.length, `${interfaceName} declared no required fields`).toBeGreaterThan(0);

  const violations: string[] = [];
  for (const item of items) {
    for (const field of fields) {
      if (!(field in item)) {
        violations.push(`${field}: absent from the response`);
      } else if (item[field] === null) {
        violations.push(`${field}: null`);
      }
    }
  }

  expect(
    [...new Set(violations)].sort(),
    `${interfaceName} promises these are always present and non-null, but ${label} ` +
      `disagrees. The backend is right and the interface is wrong: widen it to ` +
      `\`| null\` and guard every render site, rather than "fixing" the data.`,
  ).toEqual([]);
}

describe("PACMS DTO shape", () => {
  it("Category matches /api/Storefront/Categories", async () => {
    const categories = await read<Record<string, unknown>[]>(
      `/api/Storefront/Categories?brandSlug=${BRAND}`,
    );
    assertShape("Category", flattenCategories(categories), "Categories");
  });

  it("Tag matches /api/Storefront/TagsByBrand", async () => {
    const tags = await read<Record<string, unknown>[]>(
      `/api/Storefront/TagsByBrand?brandSlug=${BRAND}`,
    );
    assertShape("Tag", tags, "TagsByBrand");
  });

  it("Catalog matches /api/Storefront/CatalogsByBrand", async () => {
    const catalogs = await read<Record<string, unknown>[]>(
      `/api/Storefront/CatalogsByBrand?brandSlug=${BRAND}`,
    );
    assertShape("Catalog", catalogs, "CatalogsByBrand");
  });

  it("ProductCardData matches /api/Storefront/FilteredProducts", async () => {
    // A wide page on purpose: a single card proves almost nothing about a field
    // that is null on 3% of rows, which is the shape of every bug this catches.
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
    assertShape("ProductCardData", result.data, "FilteredProducts");
  });

  it("Product matches /api/Storefront/ProductBySlug", async () => {
    const product = await read<Record<string, unknown>>(
      `/api/Storefront/ProductBySlug?slug=${encodeURIComponent(PRODUCT_SLUG)}`,
    );
    assertShape("Product", [product], "ProductBySlug");
  });
});
