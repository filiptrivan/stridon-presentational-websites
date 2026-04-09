export type DealerCategory = "online" | "dealer" | "service" | "outOfWarranty";

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
