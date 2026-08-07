"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import JourneyForm from "@/components/journey/JourneyForm";
import type { LatLng } from "@/components/journey/JourneyMap";
import { useEmergency } from "@/app/hooks/use-emergency";
import { reverseGeocode } from "@/lib/geocode";

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

const DEFAULT_ORIGIN: LatLng = [41.8781, -87.6298];
const DEFAULT_LOCATION_LABEL = "Chicago, IL, USA";

export default function JourneyPage() {
  const { triggerSOS, isTriggering, error: sosError } = useEmergency();

  const [currentLocation, setCurrentLocation] = useState(
    DEFAULT_LOCATION_LABEL
  );

  const [origin, setOrigin] = useState<LatLng>(DEFAULT_ORIGIN);
  const [locating, setLocating] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [routePath, setRoutePath] = useState<LatLng[]>([]);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocating(false);
      setLocationError("Browser tidak mendukung deteksi lokasi.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords: LatLng = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        setOrigin(coords);

        const address = await reverseGeocode(
          coords[0],
          coords[1]
        );

        setCurrentLocation(
          address ??
            `${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}`
        );

        setLocating(false);
      },

      (err) => {
        console.error("Geolocation error:", err);

        setLocationError(
          err.code === err.PERMISSION_DENIED
            ? "Akses lokasi ditolak. Menggunakan lokasi default."
            : "Gagal mendeteksi lokasi. Menggunakan lokasi default."
        );

        setLocating(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }, []);

  const handleDestinationSelect = (
    label: string,
    coords: LatLng
  ) => {
    setDestination(coords);

    // Straight-line placeholder route.
    // Replace with real routing API later if needed.
    setRoutePath([origin, coords]);
  };

  const handleStartTracking = () => {
    if (!destination) {
      alert("Pilih destinasi dulu sebelum mulai tracking.");
      return;
    }

    console.log(
      "Start tracking from",
      origin,
      "to",
      destination
    );
  };

  const handleSOS = async () => {
    try {
      const { event } = await triggerSOS();
      console.log(event.latitude, event.longitude)
      window.open(
        `https://maps.google.com/?q=${event.latitude},${event.longitude}`,
        "_blank"
      );
    } catch (e) {
      console.error("SOS trigger failed:", e);
    }
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background:
          "var(--background-pink, radial-gradient(50% 50% at 50% 50%, var(--Colors-Primary-100, #FAD5EE) 0%, var(--Colors-Primary-200, #F5ABDE) 100%))",
      }}
    >
      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-[9999]">
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="pt-24">
        {/* Map */}
        <div className="relative z-0 px-4 pb-4">
          <JourneyMap
            origin={origin}
            destination={destination}
            routePath={routePath}
          />
        </div>

        {/* Journey Form */}
        <JourneyForm
          currentLocation={currentLocation}
          onCurrentLocationChange={setCurrentLocation}
          onDestinationSelect={handleDestinationSelect}
          onStartTracking={handleStartTracking}
          onSOS={handleSOS}
          locating={locating}
          locationError={locationError}
          sosTriggering={isTriggering}
        />
        {sosError && (
          <p className="mx-4 mt-3 rounded-xl bg-red-100 px-4 py-2 text-center text-sm font-medium text-red-700">
            {sosError}
          </p>
        )}
      </main>
    </div>
  );
} 