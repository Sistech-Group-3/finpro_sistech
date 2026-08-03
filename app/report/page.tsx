"use client";

import { useState } from "react";
import { MapPin, Crosshair, Info, UploadCloud } from "lucide-react";

const CATEGORIES = [
  "Harassment",
  "Stalking",
  "Physical Assault",
  "Verbal Abuse",
  "Suspicious Activity",
  "Other",
];

export default function ReportPage() {
  const [detecting, setDetecting] = useState(true);
  const [category, setCategory] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [description, setDescription] = useState("");
  const [anonymous, setAnonymous] = useState(true);

  function handleSubmit() {
    // TODO: kirim data ke backend
    console.log({ category, dateTime, description, anonymous });
  }

  return (
    <div className="space-y-4">
      {/* Location Context */}
      <div className="rounded-2xl bg-pink-50/90 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="font-semibold text-indigo-900 text-sm">
            Location Context
          </p>
          <Crosshair className="h-4 w-4 text-indigo-900/60" />
        </div>

        <div className="relative h-36 bg-neutral-200 flex items-center justify-center">
          <div className="absolute inset-0 opacity-30 bg-[linear-gradient(45deg,transparent_48%,#00000022_49%,#00000022_51%,transparent_52%)] bg-[length:20px_20px]" />
          <div className="relative flex items-center gap-2 bg-pink-50 rounded-lg px-3 py-2 shadow-sm border border-pink-200">
            <MapPin className="h-4 w-4 text-pink-600" />
            <span className="text-sm font-semibold text-pink-900">
              {detecting ? "Auto-detecting..." : "Location detected"}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2 px-4 py-3 bg-pink-100/60">
          <Info className="h-3.5 w-3.5 text-indigo-900/50 shrink-0 mt-0.5" />
          <p className="text-xs text-indigo-900/60 leading-snug">
            Precise location will be shared with verified responders only.
          </p>
        </div>
      </div>

      {/* Upload Evidence */}
      <div className="rounded-2xl bg-pink-50/90 px-4 py-4 shadow-sm">
        <p className="font-semibold text-indigo-900 text-sm mb-3">
          Upload Evidence (Optional)
        </p>

        <label className="flex flex-col items-center justify-center gap-2 rounded-xl bg-pink-100/70 border-2 border-dashed border-pink-300 py-8 cursor-pointer hover:bg-pink-100 transition-colors">
          <UploadCloud className="h-7 w-7 text-pink-600" />
          <p className="text-sm font-semibold text-indigo-900">
            Drag &amp; drop files here
          </p>
          <p className="text-xs text-indigo-900/50">
            PNG, JPG, MP4 up to 20MB
          </p>
          <span className="text-xs font-bold text-indigo-900 underline mt-1">
            Browse Files
          </span>
          <input type="file" accept="image/png,image/jpeg,video/mp4" multiple className="hidden" />
        </label>
      </div>

      {/* Report Form */}
      <div className="rounded-2xl bg-pink-50/60 border border-dashed border-indigo-300/60 px-4 py-5">
        <h2 className="font-extrabold text-indigo-900 text-lg mb-1">
          Report an Incident
        </h2>
        <p className="text-xs text-indigo-900/60 mb-4">
          Please provide accurate information. Your privacy is protected.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-pink-600 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-pink-300 bg-white px-3 py-2.5 text-sm text-indigo-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="">Select incident category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-pink-600 mb-1">
              Date &amp; Time
            </label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full rounded-lg border border-pink-300 bg-white px-3 py-2.5 text-sm text-indigo-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-pink-600">
                Description
              </label>
              <span className="text-xs text-indigo-900/40">
                {description.length}/500
              </span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              placeholder="Please describe what happened..."
              rows={6}
              className="w-full rounded-lg border border-pink-300 bg-white px-3 py-2.5 text-sm text-indigo-900 resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl bg-white/70 border border-dashed border-indigo-300/60 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-indigo-900">
                Submit Anonymously
              </p>
              <p className="text-xs text-indigo-900/50">
                Hide my identity from the public feed
              </p>
            </div>
            <button
              onClick={() => setAnonymous((a) => !a)}
              aria-pressed={anonymous}
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                anonymous ? "bg-indigo-800" : "bg-neutral-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  anonymous ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full rounded-xl bg-gradient-to-br from-[#F45FA6] to-[#C21C74] text-white font-bold text-sm py-3.5 hover:opacity-90 transition-opacity"
          >
            Send Report
          </button>
        </div>
      </div>
    </div>
  );
}