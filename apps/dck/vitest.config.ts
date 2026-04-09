import { resolve } from "path";
import { defineConfig } from "vitest/config";

process.loadEnvFile(resolve(__dirname, ".env.local"));

export default defineConfig({
  test: {
    environment: "node",
  },
});
