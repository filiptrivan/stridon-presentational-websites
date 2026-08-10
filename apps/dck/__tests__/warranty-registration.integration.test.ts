import { describe, expect, it } from "vitest";
import { PNG_1X1 } from "./fixtures/png";
import { TEST_SERIAL_PREFIX } from "./fixtures/warranty";

const API_URL = process.env.API_URL || "http://localhost:5000";
const API_KEY = process.env.PACMS_API_KEY;
const ENDPOINT = `${API_URL}/api/Storefront/SubmitWarrantyRegistration`;

// A real inbox: each successful run sends an actual DCK confirmation e-mail with the receipt
// attached, and that delivery is itself part of what the suite proves. It is deliberately NOT the
// address that receives the alerts (Sentry, red deploy gates) — those must stay readable, and this
// suite runs 5-6 times a day.
const SUBMITTER_EMAIL = "filiptrivan1@gmail.com";

function buildWarrantyFormData(
  overrides: { companyPib?: string } = {},
): FormData {
  const formData = new FormData();
  formData.append("firstName", "Test");
  formData.append("lastName", "User");
  formData.append("email", SUBMITTER_EMAIL);
  formData.append("phoneNumber", "0601234567");
  formData.append(
    "productSlug",
    "dck-krh20v-28r2k-akumulatorska-busilica-za-beton-sds-plus-sa-2x80ah-baterije-i-punjacem-20v",
  );
  // Never submit a serial without the prefix: it is what lets pa-cms reap these rows back out of
  // the production database.
  formData.append("serialNumber", `${TEST_SERIAL_PREFIX}${Date.now()}`);
  formData.append("purchaseDate", "2026-01-15T00:00:00.000Z");
  formData.append("brandSlug", "dck");
  if (overrides.companyPib !== undefined) {
    formData.append("companyPib", overrides.companyPib);
  }
  formData.append(
    "receiptImage",
    new Blob([PNG_1X1], { type: "image/png" }),
    "receipt.png",
  );
  return formData;
}

describe("Warranty Registration Integration", () => {
  it("should submit a warranty registration successfully", async () => {
    if (!API_KEY) {
      throw new Error(
        "PACMS_API_KEY must be set in .env.local to run integration tests",
      );
    }

    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "X-Api-Key": API_KEY },
      body: buildWarrantyFormData(),
    });

    expect(response.status).toBe(200);
  });

  it("should return 401 without API key", async () => {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      body: buildWarrantyFormData(),
    });

    expect(response.status).toBe(401);
  });

  it("should accept a valid 9-digit companyPib", async () => {
    if (!API_KEY) {
      throw new Error(
        "PACMS_API_KEY must be set in .env.local to run integration tests",
      );
    }

    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "X-Api-Key": API_KEY },
      body: buildWarrantyFormData({ companyPib: "123456789" }),
    });

    expect(response.status).toBe(200);
  });

  it("should reject a malformed companyPib", async () => {
    if (!API_KEY) {
      throw new Error(
        "PACMS_API_KEY must be set in .env.local to run integration tests",
      );
    }

    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "X-Api-Key": API_KEY },
      body: buildWarrantyFormData({ companyPib: "12345" }),
    });

    expect(response.status).toBe(400);
  });
});
