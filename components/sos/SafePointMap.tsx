"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LocateFixed, Layers } from "lucide-react";

export type LatLng = [number, number];

function LocateButton() {
  const map = useMap();
  return (
    <button
      onClick={() => map.locate({ setView: true, maxZoom: 16 })}
      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md hover:bg-slate-50 transition"
      aria-label="Locate me"
      type="button"
    >
      <LocateFixed className="h-4 w-4 text-slate-700" />
    </button>
  );
}

function LayerToggle({ onToggle }: { onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md hover:bg-slate-50 transition"
      aria-label="Toggle map layer"
      type="button"
    >
      <Layers className="h-4 w-4 text-slate-700" />
    </button>
  );
}

const TILE_LAYERS = {
  streets: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
  },
};

interface SafePointMapProps {
  userLocation: LatLng;
  safePoint: LatLng;
}

export default function SafePointMap({ userLocation, safePoint }: SafePointMapProps) {
  const [layer, setLayer] = useState<keyof typeof TILE_LAYERS>("streets");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pindahkan pembuat icon ke dalam useMemo agar diproses di client saja
  const userIcon = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return L.divIcon({
      className: "",
      html: `<div style="width:22px;height:22px;border-radius:9999px;background:#fff;border:2px solid #1e293b;display:flex;align-items:center;justify-content:center;">
               <div style="width:9px;height:9px;border-radius:9999px;background:#1e293b;"></div>
             </div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
  }, []);

  const safePointIcon = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return L.divIcon({
      className: "",
      html: `<div style="width:16px;height:16px;border-radius:9999px;background:#0f172a;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  }, []);

  if (!mounted || !userIcon || !safePointIcon) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-400">
        Loading map...
      </div>
    );
  }

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl">
      <MapContainer
        key={`${userLocation[0]}-${userLocation[1]}`}
        center={userLocation}
        zoom={15}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          key={layer}
          url={TILE_LAYERS[layer].url}
          attribution={TILE_LAYERS[layer].attribution}
        />

        <Marker position={userLocation} icon={userIcon} />
        <Marker position={safePoint} icon={safePointIcon} />
        <Polyline
          positions={[userLocation, safePoint]}
          pathOptions={{ color: "#64748b", weight: 3, dashArray: "6 6" }}
        />

        <div className="absolute bottom-3 right-3 z-[1000] flex flex-col gap-2">
          <LocateButton />
          <LayerToggle
            onToggle={() => setLayer((p) => (p === "streets" ? "satellite" : "streets"))}
          />
        </div>
      </MapContainer>
    </div>
  );
}