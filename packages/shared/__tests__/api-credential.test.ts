import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/lib/report-error", () => ({ reportError: vi.fn() }));

// api.ts reads the brand slug at module load; the credential is read at each call.
vi.stubEnv("API_URL", "https://api.example.test");
vi.stubEnv("NEXT_PUBLIC_BRAND_SLUG", "dck");

const { getCategories } = await import("../src/lib/api");

// The Storefront gate answers an action that is not Browser-callable only for a call carrying
// a credential (umbrella ADR 0241). These cases check the request that leaves apiFetch, or the
// error it throws before one leaves.
describe("apiFetch credential", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi
      .fn()
      .mockImplementation(async () => new Response("[]", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("STOREFRONT_SERVER_SECRET", "");
    vi.stubEnv("PACMS_SCRIPTS_API_KEY", "");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const sentHeaders = () =>
    (fetchMock.mock.calls[0][1] as RequestInit).headers as Record<string, string>;

  it("sends the Storefront server secret as X-Internal-Bypass", async () => {
    vi.stubEnv("STOREFRONT_SERVER_SECRET", "server-secret");

    await getCategories();

    expect(sentHeaders()["X-Internal-Bypass"]).toBe("server-secret");
    expect(sentHeaders()).not.toHaveProperty("X-Api-Key");
  });

  it("sends the Scripts' key as X-Api-Key when it is the only credential", async () => {
    vi.stubEnv("PACMS_SCRIPTS_API_KEY", "scripts-key");

    await getCategories();

    expect(sentHeaders()["X-Api-Key"]).toBe("scripts-key");
    expect(sentHeaders()).not.toHaveProperty("X-Internal-Bypass");
  });

  it("sends both when it has both", async () => {
    vi.stubEnv("STOREFRONT_SERVER_SECRET", "server-secret");
    vi.stubEnv("PACMS_SCRIPTS_API_KEY", "scripts-key");

    await getCategories();

    expect(sentHeaders()).toMatchObject({
      "X-Internal-Bypass": "server-secret",
      "X-Api-Key": "scripts-key",
    });
  });

  it("throws, naming both variables, and sends no request with neither", async () => {
    const call = getCategories();

    await expect(call).rejects.toThrow(/STOREFRONT_SERVER_SECRET/);
    await expect(call).rejects.toThrow(/PACMS_SCRIPTS_API_KEY/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
