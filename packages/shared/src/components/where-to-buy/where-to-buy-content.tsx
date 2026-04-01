"use client";

import Container from "../container";
import { Button } from "@brand/ui/button";
import Wrapper from "../wrapper";
import { DEALERS } from "@/constants/dealers";
import { getDistanceKm } from "@brand/shared/lib/geo";
import { cn } from "@brand/shared/lib/utils";
import type { DealerCategory } from "@brand/shared/types/dealers";
import { LocateFixed, Search, ShieldAlert, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DealerList from "./dealer-list";

const DealerMap = dynamic(() => import("./dealer-map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full rounded-lg bg-card animate-pulse flex items-center justify-center">
      <div className="text-muted-foreground text-sm">Loading map...</div>
    </div>
  ),
});

type CategoryFilter = "all" | DealerCategory;
type LocationStatus = "idle" | "loading" | "granted" | "denied" | "unavailable";

export default function WhereToBuyContent() {
  const [selectedDealerId, setSelectedDealerId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showScrollShadow, setShowScrollShadow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const categories: { key: CategoryFilter; label: string }[] = [
    { key: "all", label: "Sve" },
    { key: "online", label: "Online prodavnice" },
    { key: "dealer", label: "Ovlašćene prodavnice" },
    { key: "service", label: "Ovlašćeni servis" },
    { key: "outOfWarranty", label: "Servis van garantnog roka" },
  ];

  const distances = useMemo(() => {
    if (!userLocation) return null;
    const map = new Map<string, number>();
    for (const dealer of DEALERS) {
      map.set(
        dealer.id,
        getDistanceKm(
          userLocation.lat,
          userLocation.lng,
          dealer.coordinates.lat,
          dealer.coordinates.lng,
        ),
      );
    }
    return map;
  }, [userLocation]);

  const filteredDealers = useMemo(() => {
    const filtered = DEALERS.filter((dealer) => {
      if (activeCategory !== "all" && dealer.category !== activeCategory) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          dealer.name.toLowerCase().includes(query) ||
          (dealer.city && dealer.city.toLowerCase().includes(query))
        );
      }
      return true;
    });

    if (distances) {
      filtered.sort(
        (a, b) =>
          (distances.get(a.id) ?? Infinity) - (distances.get(b.id) ?? Infinity),
      );
    }

    return filtered;
  }, [activeCategory, searchQuery, distances]);

  const nearestDealerId = useMemo(() => {
    if (!distances || filteredDealers.length === 0) return null;
    return filteredDealers[0].id;
  }, [distances, filteredDealers]);

  function handleCategoryChange(category: CategoryFilter) {
    setActiveCategory(category);
    setSelectedDealerId(null);
    dismissError();
  }

  const dismissError = useCallback(() => {
    setLocationError(null);
  }, []);

  useEffect(() => {
    if (!locationError) return;
    const timer = setTimeout(dismissError, 5000);
    return () => clearTimeout(timer);
  }, [locationError, dismissError]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const checkScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isScrollable = scrollHeight > clientHeight;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setShowScrollShadow(isScrollable && !atBottom);
    };

    checkScroll();
    container.addEventListener("scroll", checkScroll);
    return () => container.removeEventListener("scroll", checkScroll);
  }, [filteredDealers]);

  function handleFindNearest() {
    if (!navigator.geolocation) {
      setLocationStatus("unavailable");
      setLocationError(
        "Lokacija nije dostupna u tvom pretraživaču. Pretraži po gradu.",
      );
      return;
    }

    setLocationStatus("loading");
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(loc);
        setLocationStatus("granted");

        let nearestId: string | null = null;
        let minDist = Infinity;
        for (const dealer of DEALERS) {
          const dist = getDistanceKm(
            loc.lat,
            loc.lng,
            dealer.coordinates.lat,
            dealer.coordinates.lng,
          );
          if (dist < minDist) {
            minDist = dist;
            nearestId = dealer.id;
          }
        }
        if (nearestId) {
          setSelectedDealerId(nearestId);
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus("denied");
          setLocationError("Pristup lokaciji je odbijen. Pretraži po gradu.");
        } else {
          setLocationStatus("unavailable");
          setLocationError(
            "Lokacija nije dostupna u tvom pretraživaču. Pretraži po gradu.",
          );
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }

  function handleSelectDealer(id: string | null) {
    setSelectedDealerId(id);
    if (id && !window.matchMedia("(min-width: 1024px)").matches) {
      mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleClearLocation() {
    setUserLocation(null);
    setLocationStatus("idle");
    setLocationError(null);
    setSelectedDealerId(null);
  }

  const isLocationActive =
    locationStatus === "granted" && userLocation !== null;

  return (
    <Wrapper className="py-6 sm:py-8">
      <Container delay={0.2}>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Pretraži po imenu ili gradu..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  dismissError();
                }}
                className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>
            {isLocationActive ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearLocation}
                className="shrink-0 h-[42px]"
              >
                <X className="size-4" />
                <span className="hidden sm:inline">Obriši</span>
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={handleFindNearest}
                disabled={locationStatus === "loading"}
                className="shrink-0 h-[42px]"
              >
                <LocateFixed
                  className={cn(
                    "size-4",
                    locationStatus === "loading" && "animate-pulse",
                  )}
                />
                <span className="hidden sm:inline">
                  {locationStatus === "loading"
                    ? "Lociranje..."
                    : "Pronađi najbliže"}
                </span>
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => handleCategoryChange(cat.key)}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  activeCategory === cat.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/30",
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Location error */}
        {locationError && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <ShieldAlert className="size-4 shrink-0" />
            <span>{locationError}</span>
          </div>
        )}

        {/* Dealer count */}
        <p className="text-sm text-muted-foreground mb-4">
          {`${filteredDealers.length} prodavaca`}
        </p>

        {/* Main grid: list left, map right */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6">
          {/* Map - shows first on mobile */}
          <div
            ref={mapRef}
            className="order-1 lg:order-2 rounded-lg overflow-hidden border border-border h-[320px] sm:h-[380px] lg:h-[560px] z-10 scroll-mt-20"
          >
            <DealerMap
              dealers={filteredDealers}
              selectedDealerId={selectedDealerId}
              onSelectDealer={handleSelectDealer}
              userLocation={userLocation}
            />
          </div>

          {/* List */}
          <div className="relative order-2 lg:order-1">
            <div
              ref={scrollContainerRef}
              className="lg:max-h-[560px] lg:overflow-y-auto"
            >
              <DealerList
                dealers={filteredDealers}
                selectedDealerId={selectedDealerId}
                onSelectDealer={handleSelectDealer}
                distances={distances}
                nearestDealerId={nearestDealerId}
              />
            </div>
            <div
              className={cn(
                "pointer-events-none absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-background to-transparent transition-opacity duration-300 hidden lg:block",
                showScrollShadow ? "opacity-100" : "opacity-0",
              )}
            />
          </div>
        </div>
      </Container>
    </Wrapper>
  );
}
