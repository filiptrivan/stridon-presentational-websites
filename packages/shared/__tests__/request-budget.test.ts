import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { budgetMsFor } from "../src/lib/request-budget";

// budgetMsFor reads the environment at CALL time, not at module load — a build
// and a serve run the same bundle, so a value captured at import would freeze
// the build budget into the lambda.
describe("budgetMsFor", () => {
  const original = { ...process.env };

  beforeEach(() => {
    delete process.env.CI;
    delete process.env.NEXT_PHASE;
    process.env.NODE_ENV = "production";
  });

  afterEach(() => {
    process.env = { ...original };
  });

  it("gives the entity fetch a longer budget than the listings around it", () => {
    expect(budgetMsFor("critical")).toBeGreaterThan(budgetMsFor("auxiliary"));
  });

  it("bounds both runtime tiers well under Cloudflare's ~100s cutoff", () => {
    // The whole point: a stalled backend must fail fast and named, not hang the
    // lambda until the edge gives up with a 522/524 (the 2026-07-17 shape).
    expect(budgetMsFor("critical")).toBeLessThan(10_000);
    expect(budgetMsFor("auxiliary")).toBeLessThan(10_000);
  });

  it("lifts every tier during a production build", () => {
    process.env.NEXT_PHASE = "phase-production-build";
    // Prerendering every category and tag against a cold EU backend legitimately
    // outruns a 2.5s serve budget; apps/*/next.config.ts already carries
    // staticGenerationRetryCount for exactly this blip.
    expect(budgetMsFor("auxiliary")).toBeGreaterThan(30_000);
    expect(budgetMsFor("critical")).toBe(budgetMsFor("auxiliary"));
  });

  it("lifts every tier on CI, where NEXT_PHASE is not set for us", () => {
    process.env.CI = "1";
    expect(budgetMsFor("auxiliary")).toBeGreaterThan(30_000);
  });

  it("lifts the budget on a dev serve", () => {
    process.env.NODE_ENV = "development";
    expect(budgetMsFor("auxiliary")).toBeGreaterThan(30_000);
  });

  it("applies the tight runtime tiers when serving in production", () => {
    expect(budgetMsFor("auxiliary")).toBeLessThan(30_000);
    expect(budgetMsFor("critical")).toBeLessThan(30_000);
  });
});
