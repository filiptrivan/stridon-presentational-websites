import { z } from "zod";

export const WARRANTY_WINDOW_DAYS = 28;
const PURCHASE_DATE_OUT_OF_WINDOW_ERROR =
  "Produžetak garancije se može aktivirati samo u roku od 4 nedelje od kupovine.";

const DAY_MS = 24 * 60 * 60 * 1000;

// Server check tolerates 1 day on each side to cover timezone offset between
// the user's local calendar (client uses local midnight) and UTC (server).
const isPurchaseDateWithinWindow = (value: string) => {
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return false;

  const now = new Date();
  const todayUtc = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  const earliest = todayUtc - (WARRANTY_WINDOW_DAYS + 1) * DAY_MS;
  const latest = todayUtc + DAY_MS;

  const purchase = parsed.getTime();
  return purchase >= earliest && purchase <= latest;
};

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
  purchaseDate: z
    .string()
    .min(1, "Izaberi datum kupovine")
    .refine(isPurchaseDateWithinWindow, PURCHASE_DATE_OUT_OF_WINDOW_ERROR),
};

const PIB_REGEX = /^\d{9}$/;
const PIB_ERROR = "PIB mora imati tačno 9 cifara.";

export const warrantySchema = z.object({
  ...customerFields,
  companyPib: z
    .string()
    .regex(PIB_REGEX, PIB_ERROR)
    .or(z.literal(""))
    .optional(),
  product: warrantyProductSchema,
});

export const warrantyServerSchema = z.object({
  ...customerFields,
  productSlug: z.string().min(1),
  companyPib: z.string().regex(PIB_REGEX, PIB_ERROR).optional(),
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
export const INVALID_PAYLOAD_ERROR = "Podaci nisu ispravni. Proveri unos.";
export const WARRANTY_UNAVAILABLE_ERROR =
  "Produžetak garancije trenutno nije moguć. Pokušaj ponovo kasnije.";
export const WARRANTY_SUBMISSION_FAILED_ERROR =
  "Produžetak garancije nije uspeo. Pokušaj ponovo kasnije.";

export type WarrantyFormData = z.infer<typeof warrantySchema>;
