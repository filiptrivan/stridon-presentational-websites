"use server";

import {
  warrantyServerSchema,
  MAX_FILE_SIZE,
  ACCEPTED_FILE_TYPES,
  FILE_TOO_LARGE_ERROR,
  FILE_TYPE_ERROR,
  RECEIPT_REQUIRED_ERROR,
  INVALID_PAYLOAD_ERROR,
  WARRANTY_UNAVAILABLE_ERROR,
  WARRANTY_SUBMISSION_FAILED_ERROR,
} from "@/lib/schemas/warranty";
import { reportError } from "@brand/shared/lib/report-error";

const BRAND_SLUG = "dck";

/**
 * The one status whose message belongs on screen. PACMS maps `BusinessException` — and only that —
 * to 400, and those messages are hand-written Serbian addressed to the customer ("Tip fajla ... nije
 * dozvoljen.", "PIB mora imati tačno 9 cifara."). Every other failure is ours, not theirs: 401/403 is
 * a credential problem whose message would blame them for it, 422 is a client/server schema skew,
 * 5xx carries a generic placeholder anyway. Developer-facing text can't leak through here — PACMS's
 * handler sends unmapped exceptions (its English `ArgumentException` strings) as 500.
 */
const STATUS_WITH_CUSTOMER_FACING_MESSAGE = 400;

/** The `message` of a PACMS `ApiErrorDTO`, or null if the body isn't one (proxy HTML, empty body). */
function readApiErrorMessage(body: string): string | null {
  try {
    const parsed: unknown = JSON.parse(body);
    if (parsed !== null && typeof parsed === "object" && "message" in parsed) {
      const { message } = parsed as { message: unknown };
      if (typeof message === "string" && message.trim() !== "") {
        return message.trim();
      }
    }
  } catch {
    // Not JSON — nothing to surface, and not worth distinguishing from a missing message.
  }
  return null;
}

export type WarrantyActionResult =
  | { success: true }
  | { success: false; error: string };

export async function submitWarrantyRegistration(
  formData: FormData,
): Promise<WarrantyActionResult> {
  const rawCompanyPib = formData.get("companyPib");
  const raw = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber"),
    productSlug: formData.get("productSlug"),
    serialNumber: formData.get("serialNumber"),
    purchaseDate: formData.get("purchaseDate"),
    companyPib:
      typeof rawCompanyPib === "string" && rawCompanyPib.length > 0
        ? rawCompanyPib
        : undefined,
  };

  const parsed = warrantyServerSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: INVALID_PAYLOAD_ERROR };
  }

  const receiptFile = formData.get("receiptImage");
  if (!(receiptFile instanceof File) || receiptFile.size === 0) {
    return { success: false, error: RECEIPT_REQUIRED_ERROR };
  }
  if (receiptFile.size > MAX_FILE_SIZE) {
    return { success: false, error: FILE_TOO_LARGE_ERROR };
  }
  if (!ACCEPTED_FILE_TYPES.includes(receiptFile.type)) {
    return { success: false, error: FILE_TYPE_ERROR };
  }

  const apiUrl = process.env.API_URL;
  const apiKey = process.env.PACMS_API_KEY;
  if (!apiUrl || !apiKey) {
    reportError(new Error("API_URL or PACMS_API_KEY missing"), {
      source: "submitWarrantyRegistration",
    });
    return {
      success: false,
      error: WARRANTY_UNAVAILABLE_ERROR,
    };
  }

  try {
    const apiFormData = new FormData();
    apiFormData.append("firstName", parsed.data.firstName);
    apiFormData.append("lastName", parsed.data.lastName);
    apiFormData.append("email", parsed.data.email);
    apiFormData.append("phoneNumber", parsed.data.phoneNumber);
    apiFormData.append("productSlug", parsed.data.productSlug);
    apiFormData.append("serialNumber", parsed.data.serialNumber);
    apiFormData.append(
      "purchaseDate",
      `${parsed.data.purchaseDate}T00:00:00.000Z`,
    );
    apiFormData.append("brandSlug", BRAND_SLUG);
    if (parsed.data.companyPib) {
      apiFormData.append("companyPib", parsed.data.companyPib);
    }
    apiFormData.append("receiptImage", receiptFile);

    const response = await fetch(
      `${apiUrl}/api/Storefront/SubmitWarrantyRegistration`,
      {
        method: "POST",
        headers: { "X-Api-Key": apiKey },
        body: apiFormData,
      },
    );

    if (!response.ok) {
      const body = await response.text();
      const serverMessage = readApiErrorMessage(body);

      // Reported even for a 400: this action already validated payload, file type, size and PIB
      // against the same rules, so a 400 reaching here means the client and the server disagree.
      // The message rides in the title so the Sentry issue splits per cause and is readable
      // without opening an event — the WebP skew cost a round-trip to learn it was about WebP.
      reportError(
        new Error(
          `Warranty API error: ${response.status}${serverMessage ? `: ${serverMessage}` : ""}`,
        ),
        { source: "submitWarrantyRegistration", details: body },
      );

      return {
        success: false,
        error:
          response.status === STATUS_WITH_CUSTOMER_FACING_MESSAGE && serverMessage
            ? serverMessage
            : WARRANTY_SUBMISSION_FAILED_ERROR,
      };
    }

    return { success: true };
  } catch (error) {
    reportError(error, { source: "submitWarrantyRegistration" });
    return {
      success: false,
      error: WARRANTY_SUBMISSION_FAILED_ERROR,
    };
  }
}
