"use client";

import { useState } from "react";
import { Send, MapPin, Plus, Loader2, X } from "lucide-react";

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  email: string;
  initials: string;
  phone?: string;
  role: string;
}

export interface NewEmergencyContact {
  name: string;
  relation?: string;
  role?: string;
  phone?: string;
  email?: string;
}

interface EmergencyContactsProps {
  contacts: EmergencyContact[];
  onSendLocation: (contact: EmergencyContact) => void;
  onAddContact?: (contact: NewEmergencyContact) => void | Promise<void>;
  isAddingContact?: boolean;
}

const EMPTY_FORM: NewEmergencyContact = {
  name: "",
  relation: "",
  role: "",
  phone: "",
  email: "",
};

export default function EmergencyContacts({
  contacts,
  onSendLocation,
  onAddContact,
  isAddingContact = false,
}: EmergencyContactsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<NewEmergencyContact>(EMPTY_FORM);

  const handleChange =
    (field: keyof NewEmergencyContact) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !onAddContact) return;

    await onAddContact({
      name: form.name.trim(),
      relation: form.relation?.trim() || undefined,
      role: form.role?.trim() || undefined,
      phone: form.phone?.trim() || undefined,
      email: form.email?.trim() || undefined,
    });

    setForm(EMPTY_FORM);
    setIsFormOpen(false);
  };

  return (
    <div className="mx-4 rounded-3xl bg-pink-100/70 p-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-[#432F9F]">
          <MapPin className="h-4 w-4" />
          Emergency Contacts
        </h2>
        {onAddContact && (
          <button
            type="button"
            onClick={() => setIsFormOpen((open) => !open)}
            aria-label={isFormOpen ? "Close add contact form" : "Add contact"}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#432F9F] text-white shadow-sm transition-transform active:scale-95"
          >
            {isFormOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      <div className="mt-3 border-b border-[#E62DAC]/20" />

      {isFormOpen && onAddContact && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 space-y-2.5 rounded-xl border border-[#E62DAC]/20 bg-white/60 p-4"
        >
          <input
            type="text"
            value={form.name}
            onChange={handleChange("name")}
            placeholder="Name"
            required
            className="w-full rounded-lg border border-[#E62DAC]/20 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#432F9F]/40"
          />
          <input
            type="text"
            value={form.relation}
            onChange={handleChange("relation")}
            placeholder="Relation (e.g. Husband, Mother)"
            className="w-full rounded-lg border border-[#E62DAC]/20 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#432F9F]/40"
          />
          <input
            type="text"
            value={form.role}
            onChange={handleChange("role")}
            placeholder="Role (e.g. Primary Responder)"
            className="w-full rounded-lg border border-[#E62DAC]/20 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#432F9F]/40"
          />
          <input
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="Email"
            className="w-full rounded-lg border border-[#E62DAC]/20 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#432F9F]/40"
          />
          <input
            type="tel"
            value={form.phone}
            onChange={handleChange("phone")}
            placeholder="Phone (optional)"
            className="w-full rounded-lg border border-[#E62DAC]/20 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#432F9F]/40"
          />
          <button
            type="submit"
            disabled={isAddingContact || !form.name.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#432F9F] py-2.5 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98] disabled:opacity-60"
          >
            {isAddingContact ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add Contact
          </button>
        </form>
      )}

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
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-700">
                  {contact.name}
                </span>
                {(contact.relation || contact.role) && (
                  <span className="text-xs text-slate-400">
                    {[contact.relation, contact.role]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                )}
              </div>
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