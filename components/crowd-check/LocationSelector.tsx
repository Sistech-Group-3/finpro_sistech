"use client";

import { ChevronDown, MapPin } from "lucide-react";

interface LocationSelectorProps {
  location: string;
  locations: string[];
  open: boolean;
  onToggle: () => void;
  onSelect: (location: string) => void;
}

export default function LocationSelector({
  location,
  locations,
  open,
  onToggle,
  onSelect,
}: LocationSelectorProps) {
  return (
    <div className="relative mt-4">
      <button
        type="button"
        onClick={onToggle}
        className="w-full bg-[#FCE4F1] rounded-2xl px-4 py-4 text-left"
      >
        <div className="text-[#C2126B] text-xs font-semibold mb-1">
          Choose Location
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#7A1155] font-semibold">
            <MapPin className="w-4 h-4" />

            <span className="truncate">
              {location}
            </span>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-[#C2126B] transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {open && locations.length > 0 && (
        <div className="absolute z-[1000] mt-2 w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-[#F4C9E4]">
          {locations.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => onSelect(item)}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-[#FCE4F1] ${
                item === location
                  ? "text-[#C2126B] font-semibold"
                  : "text-gray-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}