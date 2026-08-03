import type { components } from "./api";

/**
 * Aliased from the generated schema — see the header in `products.ts`.
 *
 * This is the type the whole change grew out of: `imageUrl` was declared
 * `string` here while `StorefrontTagDTO.ImageUrl` has been `string?` on the
 * backend since it was written.
 */
export type Tag = components["schemas"]["StorefrontTagDTO"];
