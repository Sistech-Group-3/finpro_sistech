"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown, Loader2 } from "lucide-react";

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
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function detectLocation() {
    if (!navigator.geolocation) {
      setError("Browser tidak mendukung geolocation");
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
            "Lokasi tidak diketahui";
          const country = data.address?.country || "";

          setLocation(country ? `${city}, ${country}` : city);
        } catch {
          setError("Gagal mengambil nama lokasi");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError("Izin lokasi ditolak");
        } else {
          setError("Gagal mendapatkan lokasi");
        }
      }
    );
  }

  function selectCity(city: string) {
    setLocation(city);
    setOpen(false);
    setError(null);
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="rounded-2xl bg-pink-50/90 backdrop-blur px-5 py-4 shadow-sm">
        <p className="text-[11px] font-semibold text-pink-500 mb-1">
          Your Current Location
        </p>
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={detectLocation}
            disabled={loading}
            className="flex items-center gap-2 min-w-0 text-left disabled:opacity-70"
            title="Deteksi lokasi otomatis"
          >
            <MapPin className="h-5 w-5 text-pink-600 shrink-0" />
            <span className="font-semibold text-pink-900 text-lg truncate">
              {loading ? "Mendeteksi lokasi..." : location}
            </span>
          </button>

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Pilih kota lain"
            className="shrink-0 p-1 rounded-md hover:bg-pink-100/60 transition-colors"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 text-pink-500 animate-spin" />
            ) : (
              <ChevronDown
                className={`h-5 w-5 text-pink-500 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            )}
          </button>
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>

      {open && (
        <div className="absolute left-0 right-0 mt-2 z-20 rounded-2xl bg-white shadow-xl border border-pink-100 overflow-hidden py-1">
          <button
            onClick={detectLocation}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-indigo-900 hover:bg-pink-50 transition-colors border-b border-pink-50"
          >
            <MapPin className="h-4 w-4 text-pink-500" />
            Gunakan lokasi saat ini
          </button>

          {CITY_OPTIONS.map((city) => (
            <button
              key={city}
              onClick={() => selectCity(city)}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                city === location
                  ? "bg-pink-50 text-pink-700"
                  : "text-indigo-900 hover:bg-neutral-50"
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