"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown } from "lucide-react";

const CITY_OPTIONS = [
  "Jakarta, Indonesia",
  "Bandung, Indonesia",
  "Surabaya, Indonesia",
  "Yogyakarta, Indonesia",
  "Medan, Indonesia",
  "Semarang, Indonesia",
];

export default function LocationCard() {
  const [location, setLocation] = useState("Jakarta, Indonesia");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function detectLocation() {
    if (!navigator.geolocation) {
      setError("Browser does not support geolocation");
      return;
    }

    setLoading(true);
    setError(null);
    setOpen(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data = await res.json();

          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            "Unknown location";

          const country = data.address?.country || "";

          setLocation(country ? `${city}, ${country}` : city);
        } catch {
          setError("Failed to retrieve location name");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        setError("Failed to get location");
      }
    );
  }

  function selectCity(city: string) {
    setLocation(city);
    setOpen(false);
    setError(null);
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full"
    >
      <div className="rounded-2xl bg-pink-50/90 shadow-sm px-4 sm:px-6 py-5">
        <p className="mb-3 text-sm font-semibold text-pink-500">
          Your Current Location
        </p>

        <div className="flex items-center gap-4">
          <button
            onClick={detectLocation}
            disabled={loading}
            className="flex flex-1 min-w-0 items-center gap-3 text-left"
          >
            <MapPin className="h-6 w-6 shrink-0 text-pink-600" />

            <span className="truncate text-lg font-semibold text-pink-900">
              {loading ? "Detecting location..." : location}
            </span>
          </button>

          <button
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl hover:bg-pink-100 transition"
          >
            <ChevronDown
              className={`h-6 w-6 text-pink-500 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {error && (
          <p className="mt-2 text-xs text-red-500">
            {error}
          </p>
        )}
      </div>

      {open && (
        <div className="absolute left-0 right-0 mt-2 z-20 rounded-2xl border border-pink-100 bg-white shadow-xl overflow-hidden">
          <button
            onClick={detectLocation}
            className="flex w-full items-center gap-2 border-b border-pink-100 px-4 py-3 text-left text-gray-800 hover:bg-pink-50"
          >
            <MapPin className="h-4 w-4 text-pink-500" />
            <span className="font-medium">Use Current Location</span>
          </button>

          {CITY_OPTIONS.map((city) => (
            <button
              key={city}
              onClick={() => selectCity(city)}
              className={`w-full px-4 py-3 text-left transition-colors ${
                city === location
                  ? "bg-pink-50 font-semibold text-pink-700"
                  : "text-gray-800 hover:bg-pink-50"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}