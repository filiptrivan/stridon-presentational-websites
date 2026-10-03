import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      // `server-only` throws outside a React Server graph, and the unit tests
      // import server modules directly (api-availability imports api.ts). The
      // same stub pa-storefront's storefront-core uses.
      "server-only": resolve(__dirname, "__tests__/stubs/empty.ts"),
    },
  },
});
