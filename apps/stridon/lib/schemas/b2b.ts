import { z } from "zod";

const PIB_REGEX = /^\d{9}$/;
const REGISTRATION_NUMBER_REGEX = /^\d{8}$/;

// Same fields the old stridon.rs /b2b form collected, with its limits.
export const b2bRequestSchema = z.object({
  firstName: z
    .string()
    .min(2, "Ime mora imati bar 2 karaktera")
    .max(100, "Ime može imati najviše 100 karaktera"),
  lastName: z
    .string()
    .min(2, "Prezime mora imati bar 2 karaktera")
    .max(100, "Prezime može imati najviše 100 karaktera"),
  email: z
    .string()
    .min(1, "Unesi svoju e-mail adresu")
    .email("Unesi ispravnu e-mail adresu"),
  contactPhone: z
    .string()
    .min(6, "Kontakt telefon mora imati bar 6 karaktera")
    .max(36, "Kontakt telefon može imati najviše 36 karaktera"),
  companyName: z
    .string()
    .min(1, "Unesi naziv firme")
    .max(100, "Naziv firme može imati najviše 100 karaktera"),
  companyAddress: z
    .string()
    .min(1, "Unesi adresu firme")
    .max(100, "Adresa firme može imati najviše 100 karaktera"),
  pib: z.string().regex(PIB_REGEX, "PIB mora imati tačno 9 cifara"),
  companyRegistrationNumber: z
    .string()
    .regex(REGISTRATION_NUMBER_REGEX, "Matični broj mora imati tačno 8 cifara"),
});

export type B2bRequestData = z.infer<typeof b2bRequestSchema>;
