import { PNG_1X1 } from "./png";

export type WarrantyFormDataOverrides = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  productSlug?: string;
  serialNumber?: string;
  purchaseDate?: string;
  companyPib?: string;
  turnstileToken?: string | null;
  receiptImage?: File | null;
};

// `null` omits the field entirely; `undefined` (or omitted key) uses the default.
export function buildWarrantyFormData(
  overrides: WarrantyFormDataOverrides = {},
): FormData {
  const fd = new FormData();
  const set = (key: string, value: string | undefined, fallback: string) => {
    fd.append(key, value ?? fallback);
  };
  set("firstName", overrides.firstName, "Test");
  set("lastName", overrides.lastName, "User");
  set("email", overrides.email, "user@example.com");
  set("phoneNumber", overrides.phoneNumber, "0601234567");
  set("productSlug", overrides.productSlug, "dck-test-product");
  set("serialNumber", overrides.serialNumber, "SN-TEST-123");
  set("purchaseDate", overrides.purchaseDate, "2026-01-15");
  if (overrides.companyPib !== undefined) {
    fd.append("companyPib", overrides.companyPib);
  }
  if (overrides.turnstileToken !== null) {
    fd.append("turnstileToken", overrides.turnstileToken ?? "valid-token");
  }
  if (overrides.receiptImage !== null) {
    fd.append(
      "receiptImage",
      overrides.receiptImage ??
        new File([PNG_1X1], "receipt.png", { type: "image/png" }),
    );
  }
  return fd;
}
