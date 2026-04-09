import { describe, expect, it } from "vitest";

const API_URL = process.env.API_URL || "http://localhost:5000";
const API_KEY = process.env.PACMS_API_KEY;
const ENDPOINT = `${API_URL}/api/Storefront/SubmitWarrantyRegistration`;

function buildWarrantyFormData(): FormData {
  const formData = new FormData();
  formData.append("firstName", "Test");
  formData.append("lastName", "User");
  formData.append("email", "test@example.com");
  formData.append("phoneNumber", "0601234567");
  formData.append("productModel", "DCK Test Drill Model XR");
  formData.append("serialNumber", `SN-TEST-${Date.now()}`);
  formData.append("purchaseDate", "2026-01-15T00:00:00.000Z");
  formData.append("brandSlug", "dck");
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
});
