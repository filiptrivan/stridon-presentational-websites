import { describe, expect, it } from "vitest";

const API_URL = process.env.API_URL || "http://localhost:5000";
const API_KEY = process.env.PACMS_API_KEY;
const ENDPOINT = `${API_URL}/api/Storefront/SubmitWarrantyRegistration`;

// Minimal valid PNG for the ReceiptImage field — backend requires an actual image.
const PNG_1X1 = Uint8Array.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
  0x0d, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
  0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
  0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
]);

function buildWarrantyFormData(
  overrides: { companyPib?: string } = {},
): FormData {
  const formData = new FormData();
  formData.append("firstName", "Test");
  formData.append("lastName", "User");
  formData.append("email", "filiptrivan5@gmail.com");
  formData.append("phoneNumber", "0601234567");
  formData.append(
    "productSlug",
    "dck-krh20v-28r2k-akumulatorska-busilica-za-beton-sds-plus-sa-2x80ah-baterije-i-punjacem-20v",
  );
  formData.append("serialNumber", `SN-TEST-${Date.now()}`);
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
