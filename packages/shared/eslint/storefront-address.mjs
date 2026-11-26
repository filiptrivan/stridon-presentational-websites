// Refuses a Storefront API address (the text `/api/Storefront`) outside the shared API library.
// Thus no server caller builds its own request and forgets the credential (umbrella ADR 0241).
//
// Each app's eslint.config.mjs spreads `storefrontAddressConfig`. Allowed:
// - the shared API library: packages/shared/src/lib/storefront-client.ts and api.ts;
// - the generated OpenAPI types, packages/shared/src/types/api.ts, which name each route;
// - a test file: an integration suite keeps its own `fetch`, to see what crosses HTTP, and takes
//   its headers from `storefrontCredentialHeaders()`; a unit test mocks `fetch`.
// `turbo lint` reaches only the apps. The library files are named here for the day packages lint
// too. `apps/dck/__tests__/storefront-address-lint.test.ts` checks both cases.

const STOREFRONT_ADDRESS = "/api/Storefront";

const MESSAGE =
  "A Storefront API address belongs only in packages/shared/src/lib/storefront-client.ts or " +
  "api.ts. Call their functions: they carry the credential and throw without one.";

const noStorefrontAddress = {
  meta: {
    type: "problem",
    docs: { description: "Refuse a Storefront API address outside the shared API library." },
    schema: [],
    messages: { address: MESSAGE },
  },
  create(context) {
    const check = (node, text) => {
      if (typeof text === "string" && text.includes(STOREFRONT_ADDRESS)) {
        context.report({ node, messageId: "address" });
      }
    };
    return {
      Literal: (node) => check(node, node.value),
      TemplateElement: (node) => check(node, node.value.raw),
    };
  },
};

const storefrontAddressPlugin = {
  meta: { name: "storefront-address" },
  rules: { "no-storefront-address": noStorefrontAddress },
};

export const storefrontAddressConfig = [
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx,mts,cts}"],
    ignores: [
      "**/packages/shared/src/lib/storefront-client.ts",
      "**/packages/shared/src/lib/api.ts",
      "**/packages/shared/src/types/api.ts",
      "**/*.test.{ts,tsx}",
    ],
    plugins: { "storefront-address": storefrontAddressPlugin },
    rules: { "storefront-address/no-storefront-address": "error" },
  },
];
