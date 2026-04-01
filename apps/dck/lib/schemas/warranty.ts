import { z } from "zod";

export const warrantySchema = z.object({
  firstName: z.string().min(1, "Unesi ime").max(50),
  lastName: z.string().min(1, "Unesi prezime").max(50),
  email: z
    .string()
    .min(1, "Unesi e-mail")
    .email("Unesi ispravnu e-mail adresu"),
  phoneNumber: z.string().min(6, "Unesi broj telefona").max(20),
  productModel: z.string().min(1, "Unesi model proizvoda").max(200),
  serialNumber: z.string().min(1, "Unesi serijski broj").max(100),
  purchaseDate: z.string().min(1, "Izaberi datum kupovine"),
  dealerName: z.string().min(1, "Izaberi prodajno mesto"),
});

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
export const FILE_TOO_LARGE_ERROR =
  "Fajl je prevelik. Maksimalna veličina je 5MB.";
export const FILE_TYPE_ERROR =
  "Nepodržan format fajla. Dozvoljeni su: JPG, PNG, WebP, PDF.";

export type WarrantyFormData = z.infer<typeof warrantySchema>;
