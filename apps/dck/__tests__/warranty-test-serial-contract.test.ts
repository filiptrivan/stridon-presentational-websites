import { describe, expect, it } from "vitest";
import { TEST_SERIAL_PREFIX } from "./fixtures/warranty";

/**
 * The integration suite writes real rows into the production PACMS database, and pa-cms's
 * WarrantyTestRegistrationReaperJob deletes them again by matching this prefix. The consuming
 * half lives in a repository nothing here compiles or runs, so this assertion is the only thing
 * on this side holding the contract still.
 *
 * It runs in the unit lane on purpose: the integration lane is skipped on pull requests, which is
 * exactly when a rename would arrive.
 */
describe("warranty test-data contract with pa-cms", () => {
  it("submits the serial prefix pa-cms reaps on", () => {
    expect(TEST_SERIAL_PREFIX).toBe("SN-TEST-");
  });
});
