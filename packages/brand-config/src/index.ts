import type { BrandConfig } from "./types";
import { config as sgToolsConfig } from "./sg-tools";
import { config as dckConfig } from "./dck";

const configs: Record<string, BrandConfig> = {
  "sg-tools": sgToolsConfig,
  dck: dckConfig,
};

export function getBrandConfig(): BrandConfig {
  const slug = process.env.NEXT_PUBLIC_BRAND_SLUG;
  if (!slug || !configs[slug]) {
    throw new Error(
      `Invalid or missing NEXT_PUBLIC_BRAND_SLUG: "${slug}". Expected one of: ${Object.keys(configs).join(", ")}`,
    );
  }
  return configs[slug];
}

export type { BrandConfig } from "./types";
