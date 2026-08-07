"use client";

import { useState, useEffect } from "react";
import { Info, MapPin, LocateFixed, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { reverseGeocode } from "@/lib/geocode";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

function MapRecenter({ coords }: { coords: [number, number] }) {
  useEffect(() => {
    import("react-leaflet").then(({ useMap }) => {
    });
  }, [coords]);
  return null;
}

export default function LocationContext() {
  const [coords, setCoords] = useState<[number, number]>([-6.2088, 106.8456]);
  const [locationName, setLocationName] = useState<string>("Detecting location...");
  const [loading, setLoading] = useState<boolean>(true);
  const [customIcon, setCustomIcon] = useState<any>(null);

  useEffect(() => {
    import("leaflet").then((L) => {
      const icon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      setCustomIcon(icon);
    });
  }, []);

  const handleDetectLocation = () => {
    setLoading(true);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setCoords([lat, lng]);

          try {
            const address = await reverseGeocode(lat, lng);
            setLocationName(address || "Your Location Detected");
          } catch {
            setLocationName(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.warn("Failed to detect location / Permission denied:", error.message);
          setLocationName("Location permission not enabled");
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationName("Device does not support Geolocation");
      setLoading(false);
    }
  };

  useEffect(() => {
    handleDetectLocation();
  }, []);

  return (
    <div className="rounded-2xl border border-pink-100 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-pink-100 bg-pink-50/50 px-5 py-3.5">
        <h2 className="text-xs sm:text-sm font-bold text-gray-800">
          Location Context
        </h2>
        <button
          onClick={handleDetectLocation}
          disabled={loading}
          type="button"
          title="Re-detect location"
          className="p-1.5 text-gray-500 hover:text-pink-600 hover:bg-pink-100/60 rounded-lg transition active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-pink-600" />
          ) : (
            <LocateFixed className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Map Container */}
      <div className="relative h-48 w-full bg-neutral-100">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-xs">
            <div className="flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2 text-xs font-semibold text-pink-700 shadow-sm">
              <MapPin className="h-4 w-4 text-pink-600 animate-pulse" />
              <span>Auto-detecting...</span>
            </div>
          </div>
        )}

        {/* Render Leaflet Map with Coords Key */}
        <MapContainer
          key={`${coords[0]}-${coords[1]}`}
          center={coords}
          zoom={16}
          scrollWheelZoom={false}
          className="h-full w-full z-10"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {customIcon && (
            <Marker position={coords} icon={customIcon}>
              <Popup>
                <span className="text-xs font-semibold">{locationName}</span>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Footnote */}
      <div className="flex items-start gap-2 bg-pink-50/30 p-4 text-xs text-neutral-500">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
        <p className="leading-tight">
          Precise location will only be shared with verified responders.
        </p>
      </div>
    </div>
  );
}