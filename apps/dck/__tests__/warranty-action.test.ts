import { beforeEach, describe, expect, it, vi } from "vitest";
import { PNG_1X1 } from "./fixtures/png";
import { buildWarrantyFormData } from "./fixtures/warranty";

vi.mock("@brand/shared/lib/report-error", () => ({
  reportError: vi.fn(),
}));

vi.mock("@brand/shared/lib/turnstile-server", () => ({
  validateTurnstileToken: vi.fn(),
}));

import { reportError } from "@brand/shared/lib/report-error";
import { validateTurnstileToken } from "@brand/shared/lib/turnstile-server";
import { submitWarrantyRegistration } from "../app/produzetak-garancije/actions";
import {
  FILE_TOO_LARGE_ERROR,
  FILE_TYPE_ERROR,
  INVALID_PAYLOAD_ERROR,
  MAX_FILE_SIZE,
  RECEIPT_REQUIRED_ERROR,
  WARRANTY_SUBMISSION_FAILED_ERROR,
  WARRANTY_UNAVAILABLE_ERROR,
} from "../lib/schemas/warranty";

const mockedValidateToken = vi.mocked(validateTurnstileToken);
const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", mockFetch);
  vi.stubEnv("API_URL", "http://api.test");
  vi.stubEnv("PACMS_API_KEY", "test-pacms-key");

  mockedValidateToken.mockResolvedValue(true);
  mockFetch.mockResolvedValue({
    ok: true,
    status: 200,
    text: () => Promise.resolve(""),
  });
});

describe("submitWarrantyRegistration - DCK", () => {
  it("returns success on happy path", async () => {
    const result = await submitWarrantyRegistration(buildWarrantyFormData());
    expect(result).toEqual({ success: true });
  });

  it("returns error when turnstileToken is missing", async () => {
    const result = await submitWarrantyRegistration(
      buildWarrantyFormData({ turnstileToken: null }),
    );
    expect(result).toEqual({
      success: false,
      error: expect.stringContaining("Verifikacija nije uspela"),
    });
    expect(mockedValidateToken).not.toHaveBeenCalled();
  });

  it("returns error when Turnstile verification fails", async () => {
    mockedValidateToken.mockResolvedValue(false);
    const result = await submitWarrantyRegistration(buildWarrantyFormData());
    expect(result).toEqual({
      success: false,
      error: expect.stringContaining("Verifikacija nije uspela"),
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns error when payload is invalid", async () => {
    const result = await submitWarrantyRegistration(
      buildWarrantyFormData({ firstName: "" }),
    );
    expect(result).toEqual({
      success: false,
      error: INVALID_PAYLOAD_ERROR,
    });
  });

  it("returns error when receiptImage is missing", async () => {
    const result = await submitWarrantyRegistration(
      buildWarrantyFormData({ receiptImage: null }),
    );
    expect(result).toEqual({ success: false, error: RECEIPT_REQUIRED_ERROR });
  });

  it("returns error when receiptImage is empty", async () => {
    const emptyFile = new File([], "empty.png", { type: "image/png" });
    const result = await submitWarrantyRegistration(
      buildWarrantyFormData({ receiptImage: emptyFile }),
    );
    expect(result).toEqual({ success: false, error: RECEIPT_REQUIRED_ERROR });
  });

  it("returns error when file is too large", async () => {
    const oversized = new File(
      [new Uint8Array(MAX_FILE_SIZE + 1)],
      "big.png",
      { type: "image/png" },
    );
    const result = await submitWarrantyRegistration(
      buildWarrantyFormData({ receiptImage: oversized }),
    );
    expect(result).toEqual({ success: false, error: FILE_TOO_LARGE_ERROR });
  });

  it("returns error when file type is not accepted", async () => {
    const badType = new File([PNG_1X1], "receipt.gif", { type: "image/gif" });
    const result = await submitWarrantyRegistration(
      buildWarrantyFormData({ receiptImage: badType }),
    );
    expect(result).toEqual({ success: false, error: FILE_TYPE_ERROR });
  });

  it("returns error and reports when API_URL is missing", async () => {
    vi.stubEnv("API_URL", "");
    const result = await submitWarrantyRegistration(buildWarrantyFormData());
    expect(result).toEqual({
      success: false,
      error: WARRANTY_UNAVAILABLE_ERROR,
    });
    expect(reportError).toHaveBeenCalled();
  });

  it("returns error and reports when PACMS_API_KEY is missing", async () => {
    vi.stubEnv("PACMS_API_KEY", "");
    const result = await submitWarrantyRegistration(buildWarrantyFormData());
    expect(result).toEqual({
      success: false,
      error: WARRANTY_UNAVAILABLE_ERROR,
    });
    expect(reportError).toHaveBeenCalled();
  });

  it("returns error and reports when PACMS returns non-OK", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve("Internal Server Error"),
    });
    const result = await submitWarrantyRegistration(buildWarrantyFormData());
    expect(result).toEqual({
      success: false,
      error: WARRANTY_SUBMISSION_FAILED_ERROR,
    });
    expect(reportError).toHaveBeenCalled();
  });

  it("returns error and reports when fetch throws", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    const result = await submitWarrantyRegistration(buildWarrantyFormData());
    expect(result).toEqual({
      success: false,
      error: WARRANTY_SUBMISSION_FAILED_ERROR,
    });
    expect(reportError).toHaveBeenCalled();
  });

  it("rejects malformed companyPib", async () => {
    const result = await submitWarrantyRegistration(
      buildWarrantyFormData({ companyPib: "12345" }),
    );
    expect(result).toEqual({
      success: false,
      error: INVALID_PAYLOAD_ERROR,
    });
  });

  it("sends correct payload to PACMS with required fields", async () => {
    await submitWarrantyRegistration(buildWarrantyFormData());

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, options] = mockFetch.mock.calls[0];

    expect(url).toBe("http://api.test/api/Storefront/SubmitWarrantyRegistration");
    expect(options.method).toBe("POST");
    expect(options.headers["X-Api-Key"]).toBe("test-pacms-key");

    const body = options.body as FormData;
    expect(body).toBeInstanceOf(FormData);
    expect(body.get("firstName")).toBe("Test");
    expect(body.get("lastName")).toBe("User");
    expect(body.get("email")).toBe("user@example.com");
    expect(body.get("phoneNumber")).toBe("0601234567");
    expect(body.get("productSlug")).toBe("dck-test-product");
    expect(body.get("serialNumber")).toBe("SN-TEST-123");
    expect(body.get("purchaseDate")).toBe("2026-01-15T00:00:00.000Z");
    expect(body.get("brandSlug")).toBe("dck");
    expect(body.get("receiptImage")).toBeInstanceOf(File);
    expect(body.has("companyPib")).toBe(false);
  });

  it("includes companyPib in payload when valid 9-digit value provided", async () => {
    await submitWarrantyRegistration(
      buildWarrantyFormData({ companyPib: "123456789" }),
    );
    const body = mockFetch.mock.calls[0][1].body as FormData;
    expect(body.get("companyPib")).toBe("123456789");
  });

  it("omits companyPib from payload when empty string provided", async () => {
    await submitWarrantyRegistration(buildWarrantyFormData({ companyPib: "" }));
    const body = mockFetch.mock.calls[0][1].body as FormData;
    expect(body.has("companyPib")).toBe(false);
  });
});
