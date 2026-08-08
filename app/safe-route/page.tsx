"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import JourneyForm from "@/components/journey/JourneyForm";
import type { LatLng } from "@/components/journey/JourneyMap";
import { useEmergency } from "@/app/hooks/use-emergency";
import { reverseGeocode } from "@/lib/geocode";
import {
  ROUTE_LABELS,
  routeRiskLabel,
  formatLocalDatetime,
  type RouteOption,
  type SafeRouteResponse,
} from "@/lib/route";

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
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

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
        // Expected path (permission denied / timeout) — handled by the UI
        // fallback message below; no console noise.
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

    // Reset previous route state and fetch the ML-recommended safe routes.
    setRoutePath([]);
    setRouteOptions([]);
    setSelectedRouteIndex(0);
    setRouteError(null);
    setRouteLoading(true);

    const params = new URLSearchParams({
      lat1: origin[0].toString(),
      lon1: origin[1].toString(),
      lat2: coords[0].toString(),
      lon2: coords[1].toString(),
      datetime: formatLocalDatetime(new Date()),
    });

    fetch(`/api/safe-route?${params.toString()}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(45_000),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error ?? `Failed with status ${res.status}`);
        }
        return data as SafeRouteResponse;
      })
      .then((data) => {
        const candidates = data.candidates?.length
          ? data.candidates
          : [
              {
                route: data.route,
                risk_score_mean: data.risk_score_mean,
                risk_score_max: data.risk_score_max,
                combined_score: 0,
              },
            ];

        const options: RouteOption[] = candidates.map((c) => ({
          path: c.route.map((pt) => [pt.lat, pt.lon] as LatLng),
          riskScoreMean: c.risk_score_mean,
          riskScoreMax: c.risk_score_max,
          combinedScore: c.combined_score,
        }));

        setRouteOptions(options);
        setSelectedRouteIndex(0);
        setRoutePath(options[0]?.path ?? []);
      })
      .catch((err) => {
        const timedOut =
          err instanceof DOMException && err.name === "TimeoutError";
        console.error("Safe route fetch failed:", err);
        setRouteError(
          timedOut
            ? "Prediksi rute terlalu lama. Coba lagi."
            : err instanceof Error
              ? err.message
              : "Gagal memuat rute aman. Coba lagi nanti."
        );
      })
      .finally(() => setRouteLoading(false));
  };

  const handleRouteSelect = (index: number) => {
    if (index === selectedRouteIndex) return;
    setSelectedRouteIndex(index);
    setRoutePath(routeOptions[index]?.path ?? []);
  };

  const selectedRoute = routeOptions[selectedRouteIndex];
  const alternateRoutes = routeOptions
    .filter((_, i) => i !== selectedRouteIndex)
    .map((o) => o.path);

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
            alternateRoutes={alternateRoutes}
          />

          {routeLoading && (
            <div className="pointer-events-none absolute inset-4 z-[1100] flex items-start justify-center">
              <div className="mt-2 rounded-full bg-[#432F9F] px-4 py-2 text-xs font-semibold text-white shadow-lg">
                Mencari rute paling aman...
              </div>
            </div>
          )}

          {routeError && (
            <div className="absolute inset-x-4 bottom-20 z-[1100] rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-red-700 shadow-md">
              {routeError}
            </div>
          )}

          {selectedRoute && !routeLoading && !routeError && (
            <div className="absolute inset-x-4 bottom-4 z-[1100] flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-md">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Risiko {ROUTE_LABELS[selectedRouteIndex] ?? "rute"}
                </p>
                <p className="text-sm font-bold text-[#432F9F]">
                  Rata-rata{" "}
                  <span className="text-[#E62DAC]">
                    {selectedRoute.riskScoreMean.toFixed(1)}
                  </span>
                  {" · "}Puncak{" "}
                  <span className="text-[#E62DAC]">
                    {selectedRoute.riskScoreMax.toFixed(1)}
                  </span>
                </p>
              </div>
              <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-[#E62DAC]">
                Rute aman terpilih
              </span>
            </div>
          )}
        </div>

        {/* Route options */}
        {routeOptions.length > 0 && !routeLoading && (
          <div className="px-4 pb-4">
            <p className="mb-2 text-sm font-bold text-[#432F9F]">
              Pilih rute rekomendasi
            </p>
            <div className="flex flex-col gap-2">
              {routeOptions.map((option, i) => {
                const isSelected = i === selectedRouteIndex;
                const risk = routeRiskLabel(option.riskScoreMean);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleRouteSelect(i)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left shadow-sm transition active:scale-[0.99] ${
                      isSelected
                        ? "border-[#E62DAC] bg-pink-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-6 rounded-full"
                        style={{
                          backgroundColor: isSelected ? "#dc2626" : "#94a3b8",
                        }}
                      />
                      <span
                        className={`text-sm font-bold ${
                          isSelected ? "text-[#E62DAC]" : "text-slate-700"
                        }`}
                      >
                        {ROUTE_LABELS[i] ?? `Rute ${i + 1}`}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${risk.color}`}
                      >
                        {risk.text}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400">Risiko rata-rata</p>
                      <p className="text-sm font-bold text-[#432F9F]">
                        {option.riskScoreMean.toFixed(1)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

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