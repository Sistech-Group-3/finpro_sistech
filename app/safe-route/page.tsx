"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import JourneyForm from "@/components/journey/JourneyForm";
import type { LatLng } from "@/components/journey/JourneyMap";

// Leaflet touches `window` on import, so the map must be client-only
// and skip server-side rendering entirely.
const JourneyMap = dynamic(() => import("@/components/journey/JourneyMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 w-full items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-400">
      Loading map...
    </div>
  ),
});

// Default origin: used only as a fallback if the user denies location access
// or their browser doesn't support geolocation.
const DEFAULT_ORIGIN: LatLng = [-7.9797, 112.6304];
const DEFAULT_LOCATION_LABEL = "Jl. Merdeka No. 10, Malang";

// Reverse geocoding via Nominatim (OpenStreetMap, free, no API key).
// Public instance has rate limits — swap for a self-hosted instance or a
// paid provider (Mapbox/Google) if this needs to handle real production traffic.
async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    const data = await res.json();
    return data?.display_name ?? null;
  } catch (err) {
    console.error("Reverse geocoding failed:", err);
    return null;
  }
}

export default function JourneyPage() {
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_LOCATION_LABEL);
  const [origin, setOrigin] = useState<LatLng>(DEFAULT_ORIGIN);
  const [locating, setLocating] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [routePath, setRoutePath] = useState<LatLng[]>([]);

  // Ask for the user's location as soon as the page loads. If they allow it,
  // fill in both the map origin and the "Current Location" text field.
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocating(false);
      setLocationError("Browser tidak mendukung deteksi lokasi.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords: LatLng = [position.coords.latitude, position.coords.longitude];
        setOrigin(coords);

        const address = await reverseGeocode(coords[0], coords[1]);
        setCurrentLocation(address ?? `${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}`);
        setLocating(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        // User denied permission, or detection timed out/failed — keep the default.
        setLocationError(
          err.code === err.PERMISSION_DENIED
            ? "Akses lokasi ditolak. Menggunakan lokasi default."
            : "Gagal mendeteksi lokasi. Menggunakan lokasi default."
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleDestinationSelect = (label: string, coords: LatLng) => {
    setDestination(coords);
    // Straight-line placeholder route. Swap this for a real routing API
    // (e.g. OSRM, Mapbox Directions, Google Directions) to get an actual path.
    setRoutePath([origin, coords]);
  };

  const handleStartTracking = () => {
    if (!destination) {
      alert("Pilih destinasi dulu sebelum mulai tracking.");
      return;
    }
    // TODO: hook this up to your real tracking/session-start logic
    console.log("Start tracking from", origin, "to", destination);
  };

  const handleSOS = () => {
    // TODO: hook this up to your real SOS/emergency alert logic
    console.log("SOS triggered");
  };

  return (
    <div
      style={{
        background:
          "var(--background-pink, radial-gradient(50% 50% at 50% 50%, var(--Colors-Primary-100, #FAD5EE) 0%, var(--Colors-Primary-200, #F5ABDE) 100%))",
      }}
      className="min-h-screen w-full"
    >
      <div className="px-4 pb-4 pt-4">
        <JourneyMap origin={origin} destination={destination} routePath={routePath} />
      </div>

      <JourneyForm
        currentLocation={currentLocation}
        onCurrentLocationChange={setCurrentLocation}
        onDestinationSelect={handleDestinationSelect}
        onStartTracking={handleStartTracking}
        onSOS={handleSOS}
        locating={locating}
        locationError={locationError}
      />
    </div>
  );
}