import { z } from "zod";

const PIB_REGEX = /^\d{9}$/;
const REGISTRATION_NUMBER_REGEX = /^\d{8}$/;

/** Reads a key under `B2b.form.errors`. */
export type ErrorMessages = (key: string) => string;

/**
 * Same fields the old stridon.rs /b2b form collected, with its limits.
 *
 * A factory rather than a module constant, because every message in here is
 * shown to the visitor and therefore has to be in their language. The shape is
 * identical either way, so `B2bRequestData` is still one type for both sides of
 * the wire - the form builds it from `useTranslations`, the server action from
 * the locale the form submitted with.
 */
export function createB2bRequestSchema(t: ErrorMessages) {
  return z.object({
    firstName: z
      .string()
      .min(2, t("firstNameMin"))
      .max(100, t("firstNameMax")),
    lastName: z.string().min(2, t("lastNameMin")).max(100, t("lastNameMax")),
    email: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
    contactPhone: z.string().min(6, t("phoneMin")).max(36, t("phoneMax")),
    companyName: z
      .string()
      .min(1, t("companyNameRequired"))
      .max(100, t("companyNameMax")),
    companyAddress: z
      .string()
      .min(1, t("companyAddressRequired"))
      .max(100, t("companyAddressMax")),
    pib: z.string().regex(PIB_REGEX, t("pib")),
    companyRegistrationNumber: z
      .string()
      .regex(REGISTRATION_NUMBER_REGEX, t("registrationNumber")),
  });
}

export type B2bRequestSchema = ReturnType<typeof createB2bRequestSchema>;
export type B2bRequestData = z.infer<B2bRequestSchema>;

/** Field order on the form; labels and placeholders live in `messages/`. */
export const B2B_FIELDS = [
  { name: "firstName" },
  { name: "lastName" },
  { name: "email", type: "email" },
  { name: "contactPhone", type: "tel" },
  { name: "companyName" },
  { name: "companyAddress" },
  { name: "pib", inputMode: "numeric" },
  { name: "companyRegistrationNumber", inputMode: "numeric" },
] satisfies {
  name: keyof B2bRequestData;
  type?: string;
  inputMode?: "numeric";
}[];
