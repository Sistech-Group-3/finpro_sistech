"use client";

import { useState } from "react";
import { UserPlus, PhoneCall, Radio } from "lucide-react";
import ContactCard from "./ContactCard";

type Contact = {
  id: number;
  initials: string;
  name: string;
  relation: string;
  role: string;
};

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      initials: "MJ",
      name: "Mark Jenkins",
      relation: "Husband",
      role: "Primary Responder",
    },
    {
      id: 2,
      initials: "LS",
      name: "Linda Smith",
      relation: "Mother",
      role: "Secondary Responder",
    },
  ]);

  const handleDelete = (id: number) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
  };

  const handleEdit = (id: number) => {
    alert(`Edit contact ID: ${id}`);
  };

  const handleAdd = () => {
    alert("Add Contact");
  };

  return (
    <div className="rounded-[24px] border border-pink-200 bg-pink-50/70 p-6 shadow-sm space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Radio className="h-5 w-5 text-[#4C28BC]" />
          <h2 className="text-lg font-bold text-[#4C28BC]">
            Emergency Contacts
          </h2>
        </div>
        <div className="mt-3 border-t border-pink-200/60"></div>
      </div>

      {/* Contact List */}
      <div className="space-y-3">
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            id={contact.id}
            initials={contact.initials}
            name={contact.name}
            relation={contact.relation}
            role={contact.role}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Add Contact Button */}
      <button
        onClick={handleAdd}
        className="flex items-center justify-center gap-2 rounded-xl bg-[#4C28BC] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#3D1F9E] active:scale-95 cursor-pointer"
      >
        <UserPlus className="h-4 w-4" />
        <span>Add Contact</span>
      </button>

      {/* Auto Call Information */}
      <div className="rounded-xl border border-pink-200 bg-white p-4 shadow-xs">
        <h3 className="text-xs sm:text-sm font-bold text-gray-900">
          Auto-Call Local Authorities
        </h3>
        <p className="mt-1 text-xs sm:text-sm leading-relaxed text-gray-600">
          Automatically dial emergency services when SOS is triggered.
        </p>
      </div>
    </div>
  );
}