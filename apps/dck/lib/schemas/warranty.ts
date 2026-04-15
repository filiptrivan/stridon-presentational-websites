import { z } from "zod";

export const warrantyProductSchema = z.object(
  {
    slug: z.string().min(1),
    title: z.string().min(1),
    sku: z.string().nullable().optional(),
    imageUrl: z.string().nullable().optional(),
  },
  { error: "Izaberi proizvod iz kataloga" },
);

const customerFields = {
  firstName: z.string().min(1, "Unesi ime").max(50),
  lastName: z.string().min(1, "Unesi prezime").max(50),
  email: z
    .string()
    .min(1, "Unesi e-mail")
    .email("Unesi ispravnu e-mail adresu"),
  phoneNumber: z.string().min(6, "Unesi broj telefona").max(20),
  serialNumber: z.string().min(1, "Unesi serijski broj").max(100),
  purchaseDate: z.string().min(1, "Izaberi datum kupovine"),
};

const companyFields = {
  isCompanyOrder: z.boolean(),
  companyPib: z.string().optional(),
};

const refineCompanyPib = (
  data: { isCompanyOrder: boolean; companyPib?: string },
  ctx: z.RefinementCtx,
) => {
  if (data.isCompanyOrder && !/^\d{9}$/.test(data.companyPib ?? "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "PIB mora imati tačno 9 cifara.",
      path: ["companyPib"],
    });
  }
};

export const warrantySchema = z
  .object({
    ...customerFields,
    ...companyFields,
    product: warrantyProductSchema,
  })
  .superRefine(refineCompanyPib);

// Server action receives a flat productSlug (everything else is client-only display state).
// `isCompanyOrder` is purely a client-side toggle; the server only needs the optional companyPib value.
export const warrantyServerSchema = z.object({
  ...customerFields,
  productSlug: z.string().min(1),
  companyPib: z
    .string()
    .regex(/^\d{9}$/, "PIB mora imati tačno 9 cifara.")
    .optional(),
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
export const RECEIPT_REQUIRED_ERROR = "Dodaj fotografiju računa.";

export type WarrantyFormData = z.infer<typeof warrantySchema>;
