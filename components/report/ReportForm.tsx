"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, AlertCircle } from "lucide-react";
import AnonymousToggle from "./AnonymousToggle";
import { submitReport } from "@/lib/services/reportService";

interface ReportFormProps {
  file: File | null;
  coords: [number, number];
  locationLabel: string;
}

export default function ReportForm({ file, coords, locationLabel }: ReportFormProps) {
  // All existing state variable names kept exactly as-is
  const [category, setCategory] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await submitReport({
        category,
        description,
        isAnonymous,
        dateTime,
        coords,
        locationLabel,
        file,
      });

      // Reset form
      setCategory("");
      setDateTime("");
      setDescription("");
      setIsAnonymous(true);

      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-6 shadow-sm space-y-5">
      {/* Header Form */}
      <div>
        <h2 className="text-xl font-bold text-[#6B21A8]">
          Report an Incident
        </h2>
        <p className="mt-1 text-xs text-purple-700/80">
          Please provide accurate information. Your privacy is protected.
        </p>
      </div>

      {/* Success Notification */}
      {isSubmitted && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 transition-all animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <div className="text-xs">
            <p className="font-bold">Report Submitted Successfully!</p>
            <p className="text-emerald-700/90">
              Thank you. Your report has been received and is being processed.
            </p>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold">Submission Failed</p>
            <p className="text-red-700/90 break-words">{errorMsg}</p>
          </div>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Category Dropdown */}
        <div>
          <label className="mb-1 block text-xs font-bold text-pink-600">
            Category
          </label>
          <div className="relative flex items-center">
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none rounded-xl border border-pink-200 bg-neutral-50/50 pl-4 pr-10 py-2.5 text-xs text-gray-700 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100 cursor-pointer"
            >
              <option value="">Select incident category</option>
              <option value="harassment">Verbal Harassment</option>
              <option value="stalking">Stalking</option>
              <option value="physical">Physical Threat</option>
              <option value="other">Other</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Date & Time Input */}
        <div>
          <label className="mb-1 block text-xs font-bold text-pink-600">
            Date &amp; Time of Incident
          </label>
          <input
            type="datetime-local"
            required
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="w-full rounded-xl border border-pink-200 bg-neutral-50/50 px-3.5 py-2.5 text-xs text-gray-700 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100"
          />
        </div>

        {/* Description Input */}
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <label className="font-bold text-pink-600">Description</label>
            <span className="text-gray-400">{description.length}/500</span>
          </div>
          <textarea
            rows={4}
            maxLength={500}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please describe what happened..."
            className="w-full rounded-xl border border-pink-200 bg-neutral-50/50 p-3.5 text-xs text-gray-700 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100 placeholder:text-gray-400 resize-none"
          />
        </div>

        {/* Anonymous Toggle */}
        <AnonymousToggle
          isAnonymous={isAnonymous}
          setIsAnonymous={setIsAnonymous}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-[#CC1893] py-3 text-sm font-bold text-white shadow-md transition hover:bg-pink-700 active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending Report..." : "Send Report"}
        </button>
      </form>
    </div>
  );
}