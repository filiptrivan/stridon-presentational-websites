import type { Dealer } from "@brand/shared/types/dealers";
import { SERVICE_CENTERS } from "./service-centers";

const SERVICE_DEALERS: Dealer[] = SERVICE_CENTERS.map((sc) => ({
  id: sc.id,
  name: sc.name,
  address: sc.address,
  phone: sc.phone,
  email: sc.email,
  category: "service",
  coordinates: sc.coords,
}));

export const DEALERS: Dealer[] = [
  {
    id: "prodavnica-alata",
    name: "Prodavnica Alata",
    address: "Vojislava Ilića 141g",
    city: "Beograd",
    phone: "011/4520-171",
    email: "office@prodavnicaalata.rs",
    website: "https://www.prodavnicaalata.rs/",
    logoSrc: "/companies/svgs/prodavnicaalata.svg",
    category: "online",
    coordinates: { lat: 44.785937879592375, lng: 20.500689934951087 },
  },
  {
    id: "stridon-group",
    name: "Stridon Group D.O.O.",
    address: "Vojislava Ilića 141g",
    city: "Beograd",
    phone: "011/4520-171",
    email: "office@stridon.rs",
    website: "https://www.stridon.rs/",
    logoSrc: "/companies/svgs/stridon.webp",
    category: "dealer",
    coordinates: { lat: 44.785937879592375, lng: 20.500689934951087 },
  },
  {
    id: "tim-komerc",
    name: "Tim Komerc",
    address: "Paunova 8",
    city: "Beograd",
    phone: "011/3984-584",
    email: "tim.1@mts.rs",
    website: "https://www.timkomerc.rs/",
    category: "dealer",
    coordinates: { lat: 44.759211, lng: 20.475917 },
  },
  {
    id: "triar",
    name: "Triar",
    address: "Zemunska 267A",
    city: "Ugrinovci",
    phone: "063/865-2542",
    email: "triar267@gmail.com",
    category: "dealer",
    coordinates: { lat: 44.896542, lng: 20.246676 },
  },
  {
    id: "srnic-alati",
    name: "Srnić Alati",
    address: "Kralja Milutina 112",
    city: "Šabac",
    phone: "062/166-6202",
    email: "markosrnic@gmail.com",
    category: "dealer",
    coordinates: { lat: 44.743224, lng: 19.696605 },
  },
  {
    id: "alati-dms",
    name: "Alati DMS",
    address: "Profesora Andonovića 16",
    city: "Ralja",
    phone: "063/171-5805",
    email: "sasa.lazic0@gmail.com",
    category: "dealer",
    coordinates: { lat: 44.57595, lng: 20.559898 },
  },
  ...SERVICE_DEALERS,
];

export const UNIQUE_DEALER_NAMES = [
  ...new Set(DEALERS.map((d) => d.name)),
].sort((a, b) => a.localeCompare(b, "sr"));
