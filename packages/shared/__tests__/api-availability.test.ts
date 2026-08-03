import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { reportError } from "../src/lib/report-error";

vi.mock("next/cache", () => ({
  cacheLife: () => undefined,
  cacheTag: () => undefined,
}));
vi.mock("../src/lib/report-error", () => ({ reportError: vi.fn() }));

// api.ts reads API_URL and the brand slug at module load, so both must be set
// before the import below. @brand/config is driven by env here rather than mocked,
// so the test also proves the real module is reachable from api.ts.
vi.stubEnv("API_URL", "https://api.example.test");
vi.stubEnv("NEXT_PUBLIC_BRAND_SLUG", "dck");

const {
  getCategories,
  getTagBySlug,
  getCategoryBySlug,
  getProductBySlug,
  getFilteredProducts,
  getFilteredProductsByCategory,
  getFilteredProductsByTag,
} = await import("../src/lib/api");

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });

const timeoutError = () =>
  new DOMException("The operation was aborted due to timeout", "TimeoutError");

describe("apiFetch availability failures", () => {
  beforeEach(() => {
    vi.mocked(reportError).mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("aborts the request on a budget rather than waiting on the socket", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([]));
    vi.stubGlobal("fetch", fetchMock);

    await getCategories();

    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  // Reporting used to hang entirely off `!res.ok`, and neither of these produces a
  // Response — without the catch, adding the budget would have made backend stalls
  // less visible than the 100s 524s they replace.
  it.each([
    ["a timeout", timeoutError()],
    ["a network failure", new TypeError("fetch failed")],
  ])("reports %s", async (_label, thrown) => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(thrown));

    await expect(getCategories()).rejects.toThrow();
    expect(reportError).toHaveBeenCalledTimes(1);
  });

  it("never turns a timeout into a resolved absence", async () => {
    // The load-bearing invariant. A timeout laundered into null would render the
    // entity page as notFound(), caching a healthy URL as gone and inviting Google
    // to deindex it. Three separate 404 guards, so three call sites.
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(timeoutError()));

    await expect(getTagBySlug("dck-58")).rejects.toThrow();
    await expect(getCategoryBySlug("kutije-za-alat")).rejects.toThrow();
    await expect(getProductBySlug("whatever")).rejects.toThrow();
  });

  it("still treats a real 404 as resolved absence, and stays quiet about it", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({}, 404)));

    await expect(getTagBySlug("dck-58v")).resolves.toBeNull();
    expect(reportError).not.toHaveBeenCalled();
  });

  it("still reports a non-404 error response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({}, 500)));

    await expect(getCategories()).rejects.toThrow();
    expect(reportError).toHaveBeenCalledTimes(1);
  });
});

// The three fetchers share one request builder, so the narrowing is the only thing
// that distinguishes them — and getting it wrong returns the WRONG PRODUCTS rather
// than failing, which no availability test above would catch.
describe("FilteredProducts narrowing", () => {
  const bodyOf = async (call: () => Promise<unknown>) => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ data: [], totalRecords: 0 }));
    vi.stubGlobal("fetch", fetchMock);
    await call();
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    return JSON.parse(init.body as string);
  };

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends no category and no tag for the unfiltered listing", async () => {
    expect(await bodyOf(() => getFilteredProducts(0, 24))).toEqual({
      brandSlugs: ["dck"],
      tagSlugs: [],
      first: 0,
      rows: 24,
    });
  });

  it("adds the category without disturbing the empty tag filter", async () => {
    expect(
      await bodyOf(() => getFilteredProductsByCategory("kutije-za-alat", 24, 24)),
    ).toEqual({
      brandSlugs: ["dck"],
      tagSlugs: [],
      categorySlug: "kutije-za-alat",
      first: 24,
      rows: 24,
    });
  });

  it("replaces the empty tag filter rather than sending both", async () => {
    expect(await bodyOf(() => getFilteredProductsByTag("dck-58", 0, 12))).toEqual({
      brandSlugs: ["dck"],
      tagSlugs: ["dck-58"],
      first: 0,
      rows: 12,
    });
  });
});
