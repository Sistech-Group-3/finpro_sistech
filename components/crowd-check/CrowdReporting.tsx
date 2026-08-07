"use client";

import { useState } from "react";
import {
  ChevronDown,
  Locate,
  MapPin,
  Search,
} from "lucide-react";

import type { CrowdLevel } from "./types";

import {
  LEVEL_COLOR,
  LEVEL_LABEL,
} from "./crowdData";

interface CrowdReportingProps {
  currentLocation: string;
  reportLevel: CrowdLevel;
  onLocationChange: (value: string) => void;
  onReportLevelChange: (level: CrowdLevel) => void;
  onSendReport: () => void;
  sending: boolean;
  sentToast: boolean;
}

export default function CrowdReporting({
  currentLocation,
  reportLevel,
  onLocationChange,
  onReportLevelChange,
  onSendReport,
  sending,
  sentToast,
}: CrowdReportingProps) {
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <div className="mt-4 bg-[#FCE4F1] rounded-2xl p-5">
      <h2 className="text-[#7A1155] font-bold text-xl mb-4">
        Crowd Reporting
      </h2>

      {/* Current Location */}
      <label className="flex items-center gap-1.5 text-[#C2126B] text-xs font-semibold mb-1.5">
        <MapPin className="w-3.5 h-3.5" />
        Current Location
      </label>

      <div className="relative mb-4">
        <input
          value={currentLocation}
          onChange={(event) =>
            onLocationChange(event.target.value)
          }
          placeholder="Enter your location"
          className="w-full bg-white border border-[#E999CC] rounded-xl px-4 py-3 text-sm text-gray-800 pr-10 outline-none focus:ring-2 focus:ring-[#E0299B]"
        />

        <Locate className="w-4 h-4 text-[#C2126B] absolute right-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Crowd Area */}
      <label className="flex items-center gap-1.5 text-[#C2126B] text-xs font-semibold mb-1.5">
        <Search className="w-3.5 h-3.5" />
        Crowd Area
      </label>

      <div className="relative mb-5">
        <button
          type="button"
          onClick={() =>
            setReportOpen((open) => !open)
          }
          className="w-full bg-white border border-[#E999CC] rounded-xl px-4 py-3 text-sm text-gray-800 flex items-center justify-between"
        >
          {LEVEL_LABEL[reportLevel]} / {reportLevel}

          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${
              reportOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {reportOpen && (
          <div className="absolute z-[1000] mt-2 w-full bg-white rounded-xl shadow-lg overflow-hidden border border-[#F4C9E4]">
            {(Object.keys(LEVEL_LABEL) as CrowdLevel[]).map(
              (level) => (
                <button
                  type="button"
                  key={level}
                  onClick={() => {
                    onReportLevelChange(level);
                    setReportOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-[#FCE4F1] flex items-center gap-2"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: LEVEL_COLOR[level],
                    }}
                  />

                  {LEVEL_LABEL[level]} / {level}
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={onSendReport}
        disabled={sending}
        className="w-full bg-[#E0299B] hover:bg-[#C2126B] disabled:opacity-60 text-white font-semibold rounded-xl py-3.5 transition-colors shadow-sm"
      >
        {sending ? "Sending..." : "Send Report"}
      </button>

      {sentToast && (
        <div className="mt-3 text-center text-xs font-medium text-[#7A1155] bg-white/70 rounded-lg py-2">
          Laporan berhasil dikirim. Terima kasih!
        </div>
      )}
    </div>
  );
}