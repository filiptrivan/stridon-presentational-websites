"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./dealer-map.css";
import type { Dealer } from "@brand/shared/types/dealers";

interface DealerMapProps {
  dealers: Dealer[];
  selectedDealerId: string | null;
  onSelectDealer: (id: string | null) => void;
  userLocation?: { lat: number; lng: number } | null;
}

function createMarkerIcon(isSelected: boolean) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: ${isSelected ? "oklch(44.4% 0.177 26.899)" : "#6b7280"};
      border: 3px solid ${isSelected ? "#fff" : "#9ca3af"};
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      transition: all 0.2s ease;
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
}

function createUserLocationIcon() {
  return L.divIcon({
    className: "user-location-marker",
    html: `
      <style>
        @keyframes user-loc-pulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      </style>
      <div style="position: relative; width: 18px; height: 18px;">
        <div style="
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: #3b82f6;
          border: 2.5px solid #fff;
          box-shadow: 0 0 8px rgba(59,130,246,0.5);
          z-index: 2;
        "></div>
        <div style="
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid #3b82f6;
          animation: user-loc-pulse 1.5s ease-out infinite;
          z-index: 1;
        "></div>
      </div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function buildPopupHtml(dealer: Dealer): string {
  let html = `<div class="text-sm"><p class="font-semibold text-foreground">${dealer.name}</p>`;
  if (dealer.address) html += `<p class="text-muted-foreground">${dealer.address}</p>`;
  if (dealer.city) html += `<p class="text-muted-foreground">${dealer.city}</p>`;
  if (dealer.phone) html += `<p class="text-muted-foreground">${dealer.phone}</p>`;
  html += `</div>`;
  return html;
}

export default function DealerMap({
  dealers,
  selectedDealerId,
  onSelectDealer,
  userLocation,
}: DealerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Stable refs for callbacks to avoid stale closures in marker click handlers
  const onSelectDealerRef = useRef(onSelectDealer);
  const selectedDealerIdRef = useRef(selectedDealerId);
  useEffect(() => {
    onSelectDealerRef.current = onSelectDealer;
    selectedDealerIdRef.current = selectedDealerId;
  }, [onSelectDealer, selectedDealerId]);

  // Effect 1: Map initialization
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [44.2, 20.9],
      zoom: 7,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(map);

    mapRef.current = map;

    const markers = markersRef.current;
    return () => {
      map.remove();
      mapRef.current = null;
      markers.clear();
      userMarkerRef.current = null;
    };
  }, []);

  // Effect 2: Sync dealer markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const dealerIds = new Set(dealers.map((d) => d.id));

    // Remove markers for dealers no longer in list
    for (const [id, marker] of markersRef.current) {
      if (!dealerIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    }

    // Add new markers
    for (const dealer of dealers) {
      if (markersRef.current.has(dealer.id)) continue;

      const marker = L.marker(
        [dealer.coordinates.lat, dealer.coordinates.lng],
        { icon: createMarkerIcon(dealer.id === selectedDealerIdRef.current) },
      ).addTo(map);

      marker.bindPopup(buildPopupHtml(dealer));

      marker.on("click", () => {
        const currentSelected = selectedDealerIdRef.current;
        onSelectDealerRef.current(dealer.id === currentSelected ? null : dealer.id);
      });

      markersRef.current.set(dealer.id, marker);
    }
  }, [dealers]);

  // Effect 3: Respond to selection changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Update all marker icons
    for (const dealer of dealers) {
      const marker = markersRef.current.get(dealer.id);
      if (marker) {
        marker.setIcon(createMarkerIcon(dealer.id === selectedDealerId));
      }
    }

    if (selectedDealerId) {
      const dealer = dealers.find((d) => d.id === selectedDealerId);
      const marker = markersRef.current.get(selectedDealerId);
      if (dealer && marker) {
        map.flyTo([dealer.coordinates.lat, dealer.coordinates.lng], 13, {
          duration: 1,
        });
        const onMoveEnd = () => {
          marker.openPopup();
        };
        map.once("moveend", onMoveEnd);
        return () => {
          map.off("moveend", onMoveEnd);
        };
      }
    } else {
      map.closePopup();
    }
  }, [selectedDealerId, dealers]);

  // Effect 4: User location marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userLocation) {
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: createUserLocationIcon(),
        interactive: false,
        zIndexOffset: 1000,
      }).addTo(map);
    }
  }, [userLocation]);

  return <div ref={mapContainerRef} className="h-full w-full rounded-lg" />;
}
