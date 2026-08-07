"use client";

import { useState } from "react";
import { User, CheckCircle2 } from "lucide-react";

export default function ProfileManagement() {
  const [name, setName] = useState("Sarah Jenkins");
  const [email, setEmail] = useState("sarah.j@example.com");
  const [phone, setPhone] = useState("+1 (555) 012-3456");

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div className="rounded-[24px] border border-pink-200 bg-pink-50/70 p-6 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <User className="h-5 w-5 text-[#4C28BC]" />
        <h2 className="text-lg font-bold text-[#4C28BC]">
          Profile Management
        </h2>
      </div>

      <div className="border-t border-pink-200/60"></div>

      {/* Success Notification */}
      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs sm:text-sm font-medium text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Profile updated successfully.</span>
        </div>
      )}

      {/* Form Container */}
      <div className="rounded-xl border border-pink-200 bg-white p-5 shadow-xs">
        <form onSubmit={handleSave} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-pink-500">
              Full Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-pink-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-pink-400 text-gray-800"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-pink-500">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-pink-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-pink-400 text-gray-800"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-pink-500">
              Phone Number
            </label>

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-pink-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:border-pink-400 text-gray-800"
            />
          </div>

          {/* Change Password Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-xl bg-[#E61994] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#CC1482] transition active:scale-95 cursor-pointer"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}