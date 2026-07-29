import { beforeEach, describe, expect, it, vi } from "vitest";
import { PNG_1X1 } from "./fixtures/png";
import {
  DEFAULT_PURCHASE_DATE,
  buildWarrantyFormData,
} from "./fixtures/warranty";

vi.mock("@brand/shared/lib/report-error", () => ({
  reportError: vi.fn(),
}));

import { reportError } from "@brand/shared/lib/report-error";
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

const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", mockFetch);
  vi.stubEnv("API_URL", "http://api.test");
  vi.stubEnv("PACMS_API_KEY", "test-pacms-key");

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

  // A 400 is Spiderly's BusinessException: a user-correctable mistake whose message is written
  // in Serbian to be shown to the customer. Collapsing it into "pokušajte ponovo kasnije" told
  // people to retry a file that could never succeed, and hid a client/server format skew for
  // weeks (DCK Sentry 137227658).
  it("surfaces the server's message on 400 instead of the generic error", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      text: () =>
        Promise.resolve(
          JSON.stringify({
            statusCode: 400,
            message: "Tip fajla 'image/webp' nije dozvoljen.",
          }),
        ),
    });
    const result = await submitWarrantyRegistration(buildWarrantyFormData());
    expect(result).toEqual({
      success: false,
      error: "Tip fajla 'image/webp' nije dozvoljen.",
    });
  });

  // Still reported: the client pre-validates type, size, PIB and payload with the same rules,
  // so any 400 that reaches here means client and server disagree — a skew signal, not user error.
  it("reports a 400 with the server message in the Sentry title", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      text: () =>
        Promise.resolve(
          JSON.stringify({ statusCode: 400, message: "PIB mora imati tačno 9 cifara." }),
        ),
    });
    await submitWarrantyRegistration(buildWarrantyFormData());
    expect(reportError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Warranty API error: 400: PIB mora imati tačno 9 cifara.",
      }),
      expect.objectContaining({ source: "submitWarrantyRegistration" }),
    );
  });

  // 401/403 is a credential problem and 5xx is ours — neither is anything the customer can act
  // on, and a 403's Serbian message ("Nemate potrebnu dozvolu…") would blame them for it.
  it.each([401, 403, 422, 429, 500])(
    "keeps the generic error for status %i even when the body carries a message",
    async (status) => {
      mockFetch.mockResolvedValue({
        ok: false,
        status,
        text: () =>
          Promise.resolve(
            JSON.stringify({ statusCode: status, message: "Nemate potrebnu dozvolu." }),
          ),
      });
      const result = await submitWarrantyRegistration(buildWarrantyFormData());
      expect(result).toEqual({
        success: false,
        error: WARRANTY_SUBMISSION_FAILED_ERROR,
      });
      expect(reportError).toHaveBeenCalled();
    },
  );

  it("falls back to the generic error when a 400 body is not parseable JSON", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      text: () => Promise.resolve("<html>502 Bad Gateway</html>"),
    });
    const result = await submitWarrantyRegistration(buildWarrantyFormData());
    expect(result).toEqual({
      success: false,
      error: WARRANTY_SUBMISSION_FAILED_ERROR,
    });
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

  it("rejects purchaseDate older than 4 weeks", async () => {
    const old = new Date();
    old.setUTCDate(old.getUTCDate() - 40);
    const result = await submitWarrantyRegistration(
      buildWarrantyFormData({
        purchaseDate: old.toISOString().slice(0, 10),
      }),
    );
    expect(result).toEqual({
      success: false,
      error: INVALID_PAYLOAD_ERROR,
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("accepts purchaseDate exactly on the 28-day boundary", async () => {
    const boundary = new Date();
    boundary.setUTCDate(boundary.getUTCDate() - 28);
    const result = await submitWarrantyRegistration(
      buildWarrantyFormData({
        purchaseDate: boundary.toISOString().slice(0, 10),
      }),
    );
    expect(result).toEqual({ success: true });
  });

  it("rejects future purchaseDate", async () => {
    const future = new Date();
    future.setUTCDate(future.getUTCDate() + 5);
    const result = await submitWarrantyRegistration(
      buildWarrantyFormData({
        purchaseDate: future.toISOString().slice(0, 10),
      }),
    );
    expect(result).toEqual({
      success: false,
      error: INVALID_PAYLOAD_ERROR,
    });
  });

  it("rejects malformed purchaseDate", async () => {
    const result = await submitWarrantyRegistration(
      buildWarrantyFormData({ purchaseDate: "not-a-date" }),
    );
    expect(result).toEqual({
      success: false,
      error: INVALID_PAYLOAD_ERROR,
    });
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
    expect(body.get("purchaseDate")).toBe(`${DEFAULT_PURCHASE_DATE}T00:00:00.000Z`);
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
