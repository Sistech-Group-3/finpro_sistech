"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LocateFixed, Layers } from "lucide-react";
import RiskLegend from "./RiskLegend";

// Fix default marker icon paths (Leaflet's default icons break under bundlers like Webpack/Turbopack)
const startIcon = L.divIcon({
  className: "",
  html: `<div style="width:22px;height:22px;border-radius:9999px;background:#fff;border:2px solid #1e293b;display:flex;align-items:center;justify-content:center;">
           <div style="width:9px;height:9px;border-radius:9999px;background:#1e293b;"></div>
         </div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const endIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:9999px;background:#0f172a;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export type LatLng = [number, number];

interface JourneyMapProps {
  origin: LatLng;
  destination: LatLng | null;
  routePath?: LatLng[];
}

// Small helper so the "locate me" button can move the map imperatively
function LocateButton() {
  const map = useMap();

  const handleLocate = () => {
    map.locate({ setView: true, maxZoom: 16 });
  };

  return (
    <button
      onClick={handleLocate}
      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md"
      aria-label="Locate me"
      type="button"
    >
      <LocateFixed className="h-4 w-4 text-slate-700" />
    </button>
  );
}

function LayerToggle({
  onToggle,
}: {
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md"
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

export default function JourneyMap({ origin, destination, routePath }: JourneyMapProps) {
  const [layer, setLayer] = useState<keyof typeof TILE_LAYERS>("streets");
  const [mounted, setMounted] = useState(false);

  // Leaflet needs the DOM to exist before it initializes
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-72 w-full items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-400">
        Loading map...
      </div>
    );
  }

  return (
    <div className="relative h-72 w-full overflow-hidden rounded-2xl">
      <MapContainer
        center={origin}
        zoom={14}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          url={TILE_LAYERS[layer].url}
          attribution={TILE_LAYERS[layer].attribution}
        />

        <Marker position={origin} icon={startIcon} />
        {destination && <Marker position={destination} icon={endIcon} />}

        {routePath && routePath.length > 1 && (
          <Polyline
            positions={routePath}
            pathOptions={{
              color: "#64748b",
              weight: 3,
              dashArray: "6 6",
            }}
          />
        )}

        {/* Controls rendered inside MapContainer so useMap() works */}
        <div className="absolute bottom-3 right-3 z-[1000] flex flex-col gap-2">
          <LocateButton />
          <LayerToggle
            onToggle={() =>
              setLayer((prev) => (prev === "streets" ? "satellite" : "streets"))
            }
          />
        </div>
      </MapContainer>

      <RiskLegend />
    </div>
  );
}