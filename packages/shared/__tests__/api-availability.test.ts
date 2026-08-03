import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// api.ts reads API_URL and the brand slug at module load, so both have to exist
// before the dynamic import below.
process.env.API_URL = "https://api.example.test";

const reportError = vi.fn();

vi.mock("next/cache", () => ({
  cacheLife: () => undefined,
  cacheTag: () => undefined,
}));
vi.mock("@brand/config", () => ({
  getBrandConfig: () => ({ brandSlug: "dck" }),
}));
vi.mock("../src/lib/report-error", () => ({
  reportError: (...args: unknown[]) => reportError(...args),
}));

const importApi = async () => await import("../src/lib/api");

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const timeoutError = () =>
  new DOMException("The operation was aborted due to timeout", "TimeoutError");

describe("apiFetch availability failures", () => {
  beforeEach(() => {
    reportError.mockClear();
    process.env.NODE_ENV = "production";
    delete process.env.CI;
    delete process.env.NEXT_PHASE;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("aborts the request on a budget rather than waiting on the socket", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([]));
    vi.stubGlobal("fetch", fetchMock);

    const { getCategories } = await importApi();
    await getCategories();

    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("reports a timeout — without this the budget deletes our only signal", async () => {
    // Reporting hung off `!res.ok`, so an aborted fetch (no `res` at all) would
    // have gone to Sentry silently. That would make backend stalls LESS visible
    // than the 524s they replace.
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(timeoutError()));

    const { getCategories } = await importApi();
    await expect(getCategories()).rejects.toThrow();
    expect(reportError).toHaveBeenCalledTimes(1);
  });

  it("reports a network failure the same way", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));

    const { getCategories } = await importApi();
    await expect(getCategories()).rejects.toThrow();
    expect(reportError).toHaveBeenCalledTimes(1);
  });

  it("never turns a timeout into a resolved absence", async () => {
    // The load-bearing invariant. A timeout laundered into null would render the
    // entity page as notFound(), caching a healthy URL as gone and inviting
    // Google to deindex it.
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(timeoutError()));

    const { getTagBySlug, getCategoryBySlug, getProductBySlug } =
      await importApi();

    await expect(getTagBySlug("dck-58")).rejects.toThrow();
    await expect(getCategoryBySlug("kutije-za-alat")).rejects.toThrow();
    await expect(getProductBySlug("whatever")).rejects.toThrow();
  });

  it("still treats a real 404 as resolved absence, and stays quiet about it", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({}, 404)));

    const { getTagBySlug } = await importApi();
    await expect(getTagBySlug("dck-58v")).resolves.toBeNull();
    expect(reportError).not.toHaveBeenCalled();
  });

  it("still reports a non-404 error response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({}, 500)));

    const { getCategories } = await importApi();
    await expect(getCategories()).rejects.toThrow();
    expect(reportError).toHaveBeenCalledTimes(1);
  });
});
