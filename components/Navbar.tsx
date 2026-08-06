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
  { label: "Community Feeds", href: "/community-feeds", icon: MessageSquare },
  { label: "Anonymous Report", href: "/anonymous-report", icon: UserCheck },
  { label: "Emergency", href: "/emergency", icon: ShieldAlert },
  { label: "Safety Resources", href: "/safety-resources", icon: BookOpen },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  
  return (
    <div className="relative">
      <header className="sticky top-0 z-50 border-b border-pink-600 bg-[#CC1893]">
        <div className="mx-auto flex h-[82px] w-full items-center justify-between px-8 sm:px-6 lg:px-12">
          <Link href="/" className="flex flex-col">
            <h1 className="text-[26px] font-bold leading-none text-white">
              SisTrace
            </h1>
            <p className="mt-1 text-xs text-pink-100">
              Safety in Every Step
            </p>
          </Link>

          {/* Desktop */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {NAV_ITEMS.map(({ label, href }) => {
              const active = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`text-base font-medium transition ${
                    active
                      ? "text-white"
                      : "text-pink-100 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile */}
          <button
            onClick={() => setOpen(!open)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/30 text-white lg:hidden mr-3 sm:mr-0"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Dropdown menu */}
      {open && (
        <>
          <button
            aria-hidden
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          />

          <nav className="absolute right-4 top-full mt-2 z-40 w-64 rounded-2xl border border-pink-100 bg-white py-2 shadow-xl lg:hidden">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium ${
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