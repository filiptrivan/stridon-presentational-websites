"use server";

import {
  warrantyServerSchema,
  MAX_FILE_SIZE,
  ACCEPTED_FILE_TYPES,
  FILE_TOO_LARGE_ERROR,
  FILE_TYPE_ERROR,
  RECEIPT_REQUIRED_ERROR,
} from "@/lib/schemas/warranty";
import { reportError } from "@brand/shared/lib/report-error";
import { TURNSTILE_VERIFICATION_FAILED } from "@brand/shared/lib/turnstile";
import { validateTurnstileToken } from "@brand/shared/lib/turnstile-server";

const BRAND_SLUG = "dck";

export type WarrantyActionResult =
  | { success: true }
  | { success: false; error: string };

export async function submitWarrantyRegistration(
  formData: FormData,
): Promise<WarrantyActionResult> {
  const turnstileToken = formData.get("turnstileToken");
  if (typeof turnstileToken !== "string" || !turnstileToken) {
    return { success: false, error: TURNSTILE_VERIFICATION_FAILED };
  }

  const isValidToken = await validateTurnstileToken(turnstileToken);
  if (!isValidToken) {
    return { success: false, error: TURNSTILE_VERIFICATION_FAILED };
  }

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
    return { success: false, error: "Podaci nisu ispravni. Proveri unos." };
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
      error: "Registracija trenutno nije moguća. Pokušaj ponovo kasnije.",
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
      reportError(new Error(`Warranty API error: ${response.status}`), {
        source: "submitWarrantyRegistration",
        details: body,
      });
      return {
        success: false,
        error: "Registracija nije uspela. Pokušaj ponovo kasnije.",
      };
    }

    return { success: true };
  } catch (error) {
    reportError(error, { source: "submitWarrantyRegistration" });
    return {
      success: false,
      error: "Registracija nije uspela. Pokušaj ponovo kasnije.",
    };
  }
}
