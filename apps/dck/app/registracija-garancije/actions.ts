"use server";

import {
  warrantySchema,
  MAX_FILE_SIZE,
  ACCEPTED_FILE_TYPES,
  FILE_TOO_LARGE_ERROR,
  FILE_TYPE_ERROR,
} from "@/lib/schemas/warranty";
import type { ActionResult } from "@brand/shared/types/actions";

const BRAND_SLUG = "dck";

export async function submitWarrantyRegistration(
  formData: FormData,
): Promise<ActionResult> {
  const raw = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber"),
    productModel: formData.get("productModel"),
    serialNumber: formData.get("serialNumber"),
    purchaseDate: formData.get("purchaseDate"),
    dealerName: formData.get("dealerName"),
  };

  const parsed = warrantySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Podaci nisu ispravni. Proveri unos." };
  }

  const receiptFile = formData.get("receiptImage");
  const hasReceipt =
    receiptFile instanceof File && receiptFile.size > 0;

  if (hasReceipt) {
    if (receiptFile.size > MAX_FILE_SIZE) {
      return { success: false, error: FILE_TOO_LARGE_ERROR };
    }
    if (!ACCEPTED_FILE_TYPES.includes(receiptFile.type)) {
      return { success: false, error: FILE_TYPE_ERROR };
    }
  }

  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    console.error("API_URL is not set");
    return {
      success: false,
      error: "Registracija trenutno nije moguća. Pokušaj ponovo kasnije.",
    };
  }

  try {
    const apiFormData = new FormData();
    for (const [key, value] of Object.entries(parsed.data)) {
      apiFormData.append(key, value);
    }
    apiFormData.append("brandSlug", BRAND_SLUG);

    if (hasReceipt) {
      apiFormData.append("receiptImage", receiptFile);
    }

    const response = await fetch(
      `${apiUrl}/api/Storefront/SubmitWarrantyRegistration`,
      {
        method: "POST",
        body: apiFormData,
      },
    );

    if (!response.ok) {
      const body = await response.text();
      console.error("Warranty API error:", response.status, body);
      return {
        success: false,
        error: "Registracija nije uspela. Pokušaj ponovo kasnije.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to submit warranty registration:", error);
    return {
      success: false,
      error: "Registracija nije uspela. Pokušaj ponovo kasnije.",
    };
  }
}
