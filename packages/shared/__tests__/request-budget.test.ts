import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { budgetMsFor } from "../src/lib/request-budget";

describe("budgetMsFor", () => {
  beforeEach(() => {
    vi.stubEnv("CI", undefined);
    vi.stubEnv("NEXT_PHASE", undefined);
    vi.stubEnv("NODE_ENV", "production");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("gives the entity fetch a longer budget than the listings around it", () => {
    expect(budgetMsFor("critical")).toBeGreaterThan(budgetMsFor("auxiliary"));
  });

  it("bounds both runtime tiers well under Cloudflare's ~100s cutoff", () => {
    expect(budgetMsFor("critical")).toBeLessThan(10_000);
    expect(budgetMsFor("auxiliary")).toBeLessThan(10_000);
  });

  it("lifts every tier during a production build", () => {
    vi.stubEnv("NEXT_PHASE", "phase-production-build");
    expect(budgetMsFor("auxiliary")).toBeGreaterThan(30_000);
    expect(budgetMsFor("critical")).toBe(budgetMsFor("auxiliary"));
  });

  it("lifts every tier on CI, where NEXT_PHASE is not set for us", () => {
    vi.stubEnv("CI", "1");
    expect(budgetMsFor("auxiliary")).toBeGreaterThan(30_000);
  });

  it("lifts the budget on a dev serve", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(budgetMsFor("auxiliary")).toBeGreaterThan(30_000);
  });
});
