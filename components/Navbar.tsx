"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutGrid,
  MessageSquare,
  UserCheck,
  ShieldAlert,
  BookOpen,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutGrid },
  { label: "Community Feeds", href: "/feed", icon: MessageSquare },
  { label: "Anonymous Report", href: "/report", icon: UserCheck },
  { label: "Emergency", href: "/emergency", icon: ShieldAlert },
  { label: "Safety Resources", href: "/safety-resources", icon: BookOpen },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <header className="bg-gradient-to-r from-[#C21C74] to-[#D6217E] px-6 pt-8 pb-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-pink-100/90" />
          <div>
            <h1 className="text-white font-extrabold text-2xl leading-tight tracking-tight">
              SisTrace
            </h1>
            <p className="text-pink-100 text-xs leading-tight">
              Safety in Every Step
            </p>
          </div>
        </Link>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="h-10 w-10 rounded-lg border border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {open && (
        <>
          <button
            aria-hidden
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 bg-black/20"
          />

          <nav className="absolute right-6 top-[calc(100%-1.25rem)] z-40 w-64 rounded-2xl bg-white shadow-xl border border-pink-100 overflow-hidden py-2">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-pink-50 text-pink-700"
                      : "text-indigo-900 hover:bg-neutral-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </>
      )}
    </div>
  );
}