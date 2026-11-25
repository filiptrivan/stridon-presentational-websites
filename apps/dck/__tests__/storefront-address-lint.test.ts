import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { ESLint, Linter } from "eslint";
import { describe, expect, it } from "vitest";

import { storefrontAddressConfig as untypedConfig } from "../../../packages/shared/eslint/storefront-address.mjs";

// The lint rule that refuses a Storefront API address outside the shared API library
// (packages/shared/eslint/storefront-address.mjs, umbrella ADR 0241). Each app runs it through
// its own eslint.config.mjs, so the refused case lints with each app's real config: a config that
// drops the rule fails here.

// A plain .mjs module, so its literal types are wider than ESLint's own.
const storefrontAddressConfig = untypedConfig as unknown as Linter.Config[];

const REPO_ROOT = resolve(__dirname, "../../..");
const RULE_ID = "storefront-address/no-storefront-address";

const OWN_FETCH = `
export async function brands() {
  const res = await fetch(\`\${process.env.API_URL}/api/Storefront/Brands\`);
  return res.json();
}
`;

async function ruleIdsFor(app: string, relativePath: string, code: string) {
  const appDir = resolve(REPO_ROOT, "apps", app);
  const eslint = new ESLint({ cwd: appDir });
  const [result] = await eslint.lintText(code, {
    filePath: resolve(appDir, relativePath),
  });
  return result.messages.map((message) => message.ruleId);
}

describe("the Storefront address lint rule", () => {
  it.each(["dck", "sg-tools", "stridon"])(
    "refuses an own fetch to /api/Storefront/Brands in %s",
    async (app) => {
      expect(await ruleIdsFor(app, "app/fixture-own-fetch.ts", OWN_FETCH)).toContain(
        RULE_ID,
      );
    },
    30_000,
  );

  it("allows an integration suite's own fetch", async () => {
    expect(
      await ruleIdsFor("dck", "__tests__/fixture.integration.test.ts", OWN_FETCH),
    ).not.toContain(RULE_ID);
  }, 30_000);

  // `turbo lint` reaches only the apps, so the library files are checked against the rule's
  // own config block, with the repo root as the base its paths resolve from.
  it.each([
    "packages/shared/src/lib/storefront-client.ts",
    "packages/shared/src/lib/api.ts",
    "packages/shared/src/types/api.ts",
  ])("allows the shared library file %s", (libraryFile) => {
    const source = readFileSync(resolve(REPO_ROOT, libraryFile), "utf8");
    expect(source).toContain("/api/Storefront");

    const messages = lintWithRuleBlock(libraryFile, source);
    expect(messages.map((message) => message.ruleId)).not.toContain(RULE_ID);
    expect(messages.filter((message) => message.fatal)).toEqual([]);
  });

  it("refuses the same fixture under the rule's own config block", () => {
    const messages = lintWithRuleBlock("packages/shared/src/lib/other.ts", OWN_FETCH);
    expect(messages.map((message) => message.ruleId)).toContain(RULE_ID);
  });
});

/** Lints `source` as the repo file `relativePath` under the rule's config block alone. */
function lintWithRuleBlock(relativePath: string, source: string) {
  return new Linter({ cwd: REPO_ROOT }).verify(
    source,
    [{ files: ["**/*.ts"], languageOptions: { parser: tsParser() } }, ...storefrontAddressConfig],
    resolve(REPO_ROOT, relativePath),
  );
}

function tsParser(): Linter.Parser {
  // eslint-config-next brings typescript-eslint; its parser reads the library's TypeScript.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@typescript-eslint/parser") as Linter.Parser;
}
