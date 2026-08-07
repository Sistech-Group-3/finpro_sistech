"use client";

import { useState } from "react";
import { AlertTriangle, Trash2, CheckCircle2 } from "lucide-react";

export default function DangerZone() {
  const [deleted, setDeleted] = useState(false);

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    setDeleted(true);

    setTimeout(() => {
      setDeleted(false);
    }, 4000);
  };

  return (
    <div className="rounded-[24px] border border-red-200 bg-red-50/70 p-6 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />

        <h2 className="text-lg font-bold text-red-600">
          Danger Zone
        </h2>
      </div>

      {/* Success Notification */}
      {deleted && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs sm:text-sm font-medium text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Account deleted successfully.</span>
        </div>
      )}

      {/* Delete Account Card */}
      <div className="rounded-xl border border-red-200 bg-white p-5 shadow-xs">
        <h3 className="text-sm font-bold text-gray-900">
          Delete Account
        </h3>

        <p className="mt-1 text-xs sm:text-sm leading-relaxed text-gray-600">
          Permanently remove all data and history. This cannot be undone.
        </p>

        <button
          onClick={handleDelete}
          className="mt-4 flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 active:scale-95 cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete Account</span>
        </button>
      </div>
    </div>
  );
}