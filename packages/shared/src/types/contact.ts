export interface ContactLocation {
  name: string;
  address: string;
  coords: { lat: number; lng: number };
  phone?: string;
  email?: string;
  badge?: string;
}
