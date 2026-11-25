// The one place a server of these sites sends a Storefront API request (umbrella ADR 0241,
// every server-side Storefront API caller carries a credential, and its client throws without
// one). The lint rule in `packages/shared/eslint/storefront-address.mjs` refuses a Storefront
// API address in any other file, except a test suite.
//
// The Storefront gate in pa-cms answers an action that is not Browser-callable only for "our
// server": a call carrying the Cloudflare edge marker, or an authenticated API key.
// - STOREFRONT_SERVER_SECRET goes as X-Internal-Bypass. Only a deployed storefront holds it,
//   and Cloudflare turns it into the edge marker, so it means nothing on loopback or a local
//   backend.
// - PACMS_SCRIPTS_API_KEY goes as X-Api-Key. Every caller that is not a deployed storefront
//   holds it: a local build, the nightly, a test suite. It passes on every host.
// Each credential present is sent. With neither, the call throws before it leaves, so a caller
// with no credential fails at once and never waits for the gate's refusal.
//
// Env is read at each call, never at module load: a test stubs it per case, and a build and a
// serve run the same bundle.
//
// Kept free of React and @brand/config, so a dck route handler or server action can import it
// without a brand slug at module load.

export const STOREFRONT_SERVER_SECRET_ENV = "STOREFRONT_SERVER_SECRET";
export const SCRIPTS_API_KEY_ENV = "PACMS_SCRIPTS_API_KEY";

export class MissingStorefrontCredentialError extends Error {
  constructor() {
    super(
      `A Storefront API call needs a credential: set ${STOREFRONT_SERVER_SECRET_ENV} ` +
        `(a deployed storefront) or ${SCRIPTS_API_KEY_ENV} (every other caller: a local ` +
        `build, a script, a test suite).`,
    );
    this.name = "MissingStorefrontCredentialError";
    Object.setPrototypeOf(this, MissingStorefrontCredentialError.prototype);
  }
}

export type StorefrontCredentialOptions = {
  /**
   * An API key that replaces the Scripts' key as X-Api-Key, for an action that authorizes the
   * key itself beyond the gate. Only the warranty registration does (its `[AuthGuard]`).
   */
  apiKey?: string;
};

/**
 * The credential headers of a Storefront API call. A test suite that keeps its own `fetch`
 * takes its headers from here. Throws when there is no credential.
 */
export function storefrontCredentialHeaders(
  options: StorefrontCredentialOptions = {},
): Record<string, string> {
  const secret = process.env[STOREFRONT_SERVER_SECRET_ENV];
  const apiKey = options.apiKey || process.env[SCRIPTS_API_KEY_ENV];

  const headers: Record<string, string> = {};
  if (secret) headers["X-Internal-Bypass"] = secret;
  if (apiKey) headers["X-Api-Key"] = apiKey;
  if (Object.keys(headers).length === 0) {
    throw new MissingStorefrontCredentialError();
  }
  return headers;
}

/**
 * Sends one request to the Storefront API with its credential. `path` starts with
 * `/api/Storefront/`. Rejects, with no request sent, when API_URL or the credential is missing.
 */
export async function storefrontFetch(
  path: string,
  init: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {},
  options: StorefrontCredentialOptions = {},
): Promise<Response> {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) throw new Error("API_URL is required");

  const credentialHeaders = storefrontCredentialHeaders(options);
  return fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      ...(init.headers as Record<string, string> | undefined),
      ...credentialHeaders,
    },
  });
}

/** dck's product search: the product autocomplete, uncached, bounded by `signal`. */
export function fetchProductsAutocompleteByBrand(
  q: string,
  brandSlug: string,
  signal: AbortSignal,
): Promise<Response> {
  return storefrontFetch(
    `/api/Storefront/ProductsAutocompleteByBrand?q=${encodeURIComponent(q)}&brandSlug=${encodeURIComponent(brandSlug)}`,
    { cache: "no-store", signal },
  );
}

/**
 * dck's warranty registration. The action's `[AuthGuard]` authorizes an API key itself, beyond
 * the gate, and the edge marker is no authentication, so dck sends its own key (`PACMS_API_KEY`).
 * No timeout: see the end of request-budget.ts.
 */
export function postWarrantyRegistration(
  body: FormData,
  apiKey: string,
): Promise<Response> {
  return storefrontFetch(
    "/api/Storefront/SubmitWarrantyRegistration",
    { method: "POST", body },
    { apiKey },
  );
}
