import type { ContactLocation } from "@brand/shared/types/contact";

export interface ServiceCenter extends ContactLocation {
  id: string;
}

export const SERVICE_CENTERS: ServiceCenter[] = [
  {
    id: "pro-servis-ns",
    name: "Pro Servis NS d.o.o.",
    address: "Temerinski put 17, 21000 Novi Sad",
    coords: { lat: 45.286782, lng: 19.832287 },
    phone: "+381-21-410000",
    email: "office@proservis.rs",
    badge: "Glavni servis",
  },
  {
    id: "elektroservis-sg",
    name: "Elektroservis SG",
    address: "Vojislava Ilića 141b, 11050 Beograd",
    coords: { lat: 44.785937, lng: 20.500664 },
    phone: "+381-65-3378812",
  },
];
