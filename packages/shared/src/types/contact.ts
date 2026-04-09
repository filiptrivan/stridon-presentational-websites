export interface ContactPhone {
  label: string;
  number: string;
}

export interface ContactHour {
  days: string;
  time: string;
}

export interface ContactLocation {
  name: string;
  address: string;
  coords: { lat: number; lng: number };
  phone?: string;
  email?: string;
}

export interface ContactInfo {
  email: string;
  phones: ContactPhone[];
  hours: ContactHour[];
}
