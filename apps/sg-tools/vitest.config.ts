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
  },
  resolve: {
    alias: {
      "@": resolve(__dirname),
    },
  },
});
