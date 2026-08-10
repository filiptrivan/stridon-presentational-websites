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

/**
 * CROSS-REPO CONTRACT. The integration suite submits real warranty registrations to the live
 * PACMS backend, so every run leaves rows in the production database. pa-cms reaps them hourly
 * by matching this exact prefix on the serial number
 * (`WarrantyTestRegistrationReaperJob.TestSerialPrefix`), and the prefix is the ONLY thing
 * separating a test submission from a real customer's.
 *
 * Changing it here without changing it there strands our rows in the admin's warranty queue
 * forever. Both sides pin the literal in a test so the drift cannot happen quietly.
 *
 * It deliberately cannot be keyed on the submitter's e-mail instead: staff register warranties
 * on behalf of customers from their own accounts, so an address identifies nobody.
 */
export const TEST_SERIAL_PREFIX = "SN-TEST-";

export type WarrantyFormDataOverrides = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  productSlug?: string;
  serialNumber?: string;
  purchaseDate?: string;
  companyPib?: string;
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
  set("serialNumber", overrides.serialNumber, `${TEST_SERIAL_PREFIX}123`);
  set("purchaseDate", overrides.purchaseDate, DEFAULT_PURCHASE_DATE);
  if (overrides.companyPib !== undefined) {
    fd.append("companyPib", overrides.companyPib);
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
