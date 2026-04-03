import { getBrandConfig } from "@brand/config";
import L from "leaflet";

const MAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

export function addBrandTileLayer(map: L.Map) {
  const { colorScheme } = getBrandConfig();
  const style = colorScheme === "dark" ? "dark_all" : "light_all";

  L.tileLayer(
    `https://{s}.basemaps.cartocdn.com/${style}/{z}/{x}/{y}{r}.png`,
    { attribution: MAP_ATTRIBUTION },
  ).addTo(map);
}
