"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { searchLocations } from "@/lib/geocode";

export interface LocationResult {
  displayName: string;
  lat: number;
  lon: number;
}

interface LocationSearchProps {
  selectedLocation: LocationResult;
  onSelect: (location: LocationResult) => void;
}

export default function LocationSearch({
  selectedLocation,
  onSelect,
}: LocationSearchProps) {
  const [query, setQuery] = useState(
    selectedLocation.displayName
  );

  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryValue = query.trim();
    if (queryValue.length < 3) {
      setResults([]);
      return;
    }

    // Jangan search lagi kalau query sama dengan lokasi
    // yang sudah dipilih.
    if (query === selectedLocation.displayName) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);

      const items = await searchLocations(queryValue, 5);
      if (controller.signal.aborted) return;

      setResults(
        items.map((item) => ({
          displayName: item.display_name,
          lat: item.lat,
          lon: item.lon,
        }))
      );
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, selectedLocation.displayName]);

  const handleSelect = (location: LocationResult) => {
    setQuery(location.displayName);
    setResults([]);
    onSelect(location);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <div className="relative mt-4">
      {/* Search Input */}
      <div className="bg-[#FCE4F1] rounded-2xl px-4 py-3 border border-[#F4C9E4]">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-[#C2126B] shrink-0" />

          <input
            type="text"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Cari lokasi..."
            className="w-full bg-transparent outline-none text-sm text-[#7A1155] placeholder:text-[#B978A3]"
          />

          {loading ? (
            <Loader2 className="w-4 h-4 text-[#C2126B] animate-spin shrink-0" />
          ) : query ? (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="shrink-0"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 z-[1000] bg-white rounded-2xl shadow-lg border border-[#F4C9E4] overflow-hidden">
          {results.map((result, index) => (
            <button
              type="button"
              key={`${result.lat}-${result.lon}-${index}`}
              onClick={() => handleSelect(result)}
              className="w-full px-4 py-3 text-left flex gap-3 hover:bg-[#FCE4F1] transition-colors"
            >
              <MapPin className="w-4 h-4 text-[#C2126B] mt-0.5 shrink-0" />

              <span className="text-sm text-gray-700 line-clamp-2">
                {result.displayName}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* No Result */}
      {!loading &&
        query.trim().length >= 3 &&
        query !== selectedLocation.displayName &&
        results.length === 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 z-[1000] bg-white rounded-2xl shadow-lg border border-[#F4C9E4] px-4 py-3">
            <p className="text-sm text-gray-500">
              Lokasi tidak ditemukan.
            </p>
          </div>
        )}
    </div>
  );
}