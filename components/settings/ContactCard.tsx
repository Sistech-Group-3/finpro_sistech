"use client";

import { Pencil, Trash2 } from "lucide-react";

type ContactCardProps = {
  id: number;
  initials: string;
  name: string;
  relation: string;
  role: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function ContactCard({
  id,
  initials,
  name,
  relation,
  role,
  onEdit,
  onDelete,
}: ContactCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-pink-200 bg-white p-4 shadow-xs">
      {/* Contact Information */}
      <div className="flex items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-200/80 font-bold text-gray-900 text-sm">
          {initials}
        </div>

        <div>
          <h3 className="font-bold text-gray-900 text-sm">{name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {relation} • {role}
          </p>
        </div>
      </div>

      {/* Contact Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(id)}
          className="rounded-lg p-2 text-gray-400 transition hover:bg-pink-50 hover:text-[#4C28BC] cursor-pointer"
          title="Edit"
        >
          <Pencil className="h-4 w-4" />
        </button>

        <button
          onClick={() => onDelete(id)}
          className="rounded-lg p-2 text-red-400 transition hover:bg-red-50 hover:text-red-600 cursor-pointer"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}