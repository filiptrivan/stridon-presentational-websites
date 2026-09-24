import { existsSync } from "fs";
import { resolve } from "path";
import { defineConfig } from "vitest/config";

const envPath = resolve(__dirname, ".env.local");
if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

export default defineConfig({
  test: {
    environment: "node",
    // The contact-action test moved to packages/shared, which covers every
    // brand, so this app has no unit test of its own right now. Without this,
    // vitest exits 1 on "No test files found" and fails pnpm test.
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname),
    },
  },
});
