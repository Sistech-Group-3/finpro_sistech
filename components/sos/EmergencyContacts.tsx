"use client";

import { Send, MapPin } from "lucide-react";

export interface EmergencyContact {
  id: string;
  name: string;
  initials: string;
  phone?: string;
}

interface EmergencyContactsProps {
  contacts: EmergencyContact[];
  onSendLocation: (contact: EmergencyContact) => void;
}

export default function EmergencyContacts({
  contacts,
  onSendLocation,
}: EmergencyContactsProps) {
  return (
    <div className="mx-4 rounded-3xl bg-pink-100/70 p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold text-[#432F9F]">
        <MapPin className="h-4 w-4" />
        Emergency Contacts
      </h2>
      <div className="mt-3 border-b border-[#E62DAC]/20" />

      <div className="mt-4 space-y-3">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center justify-between rounded-xl border border-[#E62DAC]/20 bg-white/60 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-200 text-xs font-bold text-[#901167]">
                {contact.initials}
              </div>
              <span className="text-sm font-medium text-slate-700">{contact.name}</span>
            </div>
            <button
              type="button"
              onClick={() => onSendLocation(contact)}
              aria-label={`Send location to ${contact.name}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#432F9F] text-white shadow-sm transition-transform active:scale-95"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <a
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#432F9F] py-3.5 text-center text-base font-semibold text-white shadow-md transition-transform active:scale-[0.98]"
      >
        Help Center
      </a>
    </div>
  );
}