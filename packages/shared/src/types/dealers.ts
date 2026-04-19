export type DealerCategory = "online" | "dealer" | "service";

export const DEALER_CATEGORY_LABELS: Record<DealerCategory, string> = {
  online: "Online prodavnice",
  dealer: "Ovlašćene prodavnice",
  service: "Ovlašćeni servis",
};

export interface Dealer {
  id: string;
  name: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoSrc?: string;
  category: DealerCategory;
  coordinates: { lat: number; lng: number };
}
