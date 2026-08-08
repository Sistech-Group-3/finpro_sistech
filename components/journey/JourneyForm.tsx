"use client";

import { useState } from "react";
import { Loader2, LocateFixed, Navigation, Search, ShieldAlert } from "lucide-react";
import type { LatLng } from "./JourneyMap";
import { searchLocations, type GeocodeResult } from "@/lib/geocode";

interface JourneyFormProps {
  currentLocation: string;
  onCurrentLocationChange: (value: string) => void;
  onDestinationSelect: (label: string, coords: LatLng) => void;
  onStartTracking: () => void;
  onSOS: () => void;
  /** True while the browser is fetching the user's GPS location on page load. */
  locating?: boolean;
  /** True while the SOS signal is being sent to emergency services. */
  sosTriggering?: boolean;
  /** Set when geolocation was denied or failed, so the UI can explain why the field fell back to the default. */
  locationError?: string | null;
}

export default function JourneyForm({
  currentLocation,
  onCurrentLocationChange,
  onDestinationSelect,
  onStartTracking,
  onSOS,
  locating = false,
  locationError = null,
  sosTriggering = false,
}: JourneyFormProps) {
  const [destinationQuery, setDestinationQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);

  // Debounced autocomplete (Nominatim/Photon-style geocoders rate-limit, so a
  // single request fires 400ms after typing stops instead of one per keystroke).
  useEffect(() => {
    const query = destinationQuery.trim();
    if (query.length < 3) {
      return;
    }

    setSearching(true);
    try {
      const data = await searchLocations(query, 5);
      setSuggestions(data);
    } catch (err) {
      console.error("Geocoding failed:", err);
      setSuggestions([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSelect = (result: GeocodeResult) => {
    setDestinationQuery(result.display_name);
    setSuggestions([]);
    onDestinationSelect(result.display_name, [result.lat, result.lon]);
  };

  return (
    <div className="mx-4 rounded-3xl bg-pink-100/70 p-6">
      <h2 className="text-xl font-bold text-[#432F9F]">Plan Your Safe Journey</h2>
      <p className="mt-1 text-sm text-slate-500">Choose your start and destination</p>

      {/* Current location */}
      <div className="mt-5">
        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-[#E62DAC]">
          <Navigation className="h-3.5 w-3.5" />
          Current Location
        </label>
        <div className="flex items-center rounded-xl border border-[#E62DAC]/40 bg-white px-4 py-3 shadow-sm">
          <input
            type="text"
            value={locating ? "Mendeteksi lokasi..." : currentLocation}
            onChange={(e) => onCurrentLocationChange(e.target.value)}
            disabled={locating}
            className="flex-1 bg-transparent text-sm text-slate-700 focus:outline-none disabled:text-slate-400"
          />
          <LocateFixed
            className={`h-4 w-4 shrink-0 text-[#E62DAC] ${locating ? "animate-pulse" : ""}`}
          />
        </div>
        {locationError && (
          <p className="mt-1 text-xs text-red-500">{locationError}</p>
        )}
      </div>

      {/* Destination with geocoding autocomplete */}
      <div className="relative mt-4">
        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-[#E62DAC]">
          <Navigation className="h-3.5 w-3.5 rotate-45" />
          Destination
        </label>
        <div className="flex items-center rounded-xl border border-[#E62DAC]/40 bg-white px-4 py-3 shadow-sm">
          <input
            type="text"
            value={destinationQuery}
            onChange={(e) => {
              const value = e.target.value;
              setDestinationQuery(value);
              if (value.trim().length < 3) {
                setSuggestions([]);
                setSearching(false);
              }
            }}
            placeholder="Search destination..."
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
          <Search className="h-4 w-4 shrink-0 text-[#E62DAC]" />
        </div>

        {(suggestions.length > 0 || searching) && (
          <div className="absolute z-[1100] mt-1 w-full overflow-hidden rounded-xl bg-white shadow-lg">
            {searching && (
              <div className="px-4 py-3 text-sm text-slate-400">Searching...</div>
            )}
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(s)}
                className="block w-full truncate px-4 py-3 text-left text-sm text-slate-700 hover:bg-pink-50"
              >
                {s.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-5 flex gap-3">
        <button
          onClick={onStartTracking}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#E62DAC] py-3.5 text-sm font-semibold text-white shadow-md transition-transform active:scale-[0.98]"
          type="button"
        >
          <LocateFixed className="h-4 w-4" />
          Start Smart Tracking
        </button>
        <button
          onClick={onSOS}
          disabled={sosTriggering}
          className="flex w-16 flex-col items-center justify-center gap-0.5 rounded-xl bg-[#432F9F] py-3.5 text-white shadow-md transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
        >
          {sosTriggering ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShieldAlert className="h-4 w-4" />
          )}
          <span className="text-[10px] font-bold">SOS</span>
        </button>
      </div>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500">
        🔒 Real-time monitoring will be active during your trip
      </p>
    </div>
  );
}