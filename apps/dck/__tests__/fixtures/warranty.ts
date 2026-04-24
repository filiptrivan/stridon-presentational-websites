import { PNG_1X1 } from "./png";

// Computed at import time; tests assume a recent purchase so the 28-day
// window check in warrantySchema passes. Uses yesterday (UTC) to stay safe
// against any TZ boundary effects during local test runs.
const YESTERDAY_UTC = (() => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
})();

export const DEFAULT_PURCHASE_DATE = YESTERDAY_UTC;

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
  set("purchaseDate", overrides.purchaseDate, DEFAULT_PURCHASE_DATE);
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
