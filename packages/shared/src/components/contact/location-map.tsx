"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { addBrandTileLayer } from "@brand/shared/lib/map";
import "../where-to-buy/dealer-map.css";

interface LocationMapProps {
  lat: number;
  lng: number;
  name: string;
}

export default function LocationMap({ lat, lng, name }: LocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 15,
    });

    addBrandTileLayer(map);

    const icon = L.divIcon({
      className: "custom-marker",
      html: `<div style="
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--primary);
        border: 3px solid #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      "></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    L.marker([lat, lng], { icon }).addTo(map).bindPopup(name);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lng, name]);

  return <div ref={containerRef} className="h-full w-full" />;
}
