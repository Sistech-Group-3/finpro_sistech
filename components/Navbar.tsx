"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  LayoutGrid,
  MessageSquare,
  UserCheck,
  ShieldAlert,
  BookOpen,
  Settings,
  Navigation,
  // LogOut
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Anonymous Report", href: "/report", icon: UserCheck },
  { label: "Emergency", href: "/emergency", icon: ShieldAlert },
  { label: "Crowd Check", href: "/crowd-check", icon: BookOpen },
  { label: "Feeds", href: "/feeds", icon: MessageSquare },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  // const handleLogout = async () => {
  //   await signOut();
  //   router.push("/");
  //   router.refresh();
  // };

  const displayName = user?.user_metadata?.["full_name"] ?? user?.email ?? "User";

  return (
    <div className="relative w-full">
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-pink-600 bg-[#CC1893]">
        <div className="flex h-[82px] w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex flex-col">
            <h1 className="text-[26px] font-bold leading-none text-white">
              SisTrace
            </h1>
            <p className="mt-1 text-xs text-pink-100">
              Safety in Every Step
            </p>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {NAV_ITEMS.map(({ label, href }) => {
              const active = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`text-sm font-medium transition ${
                    active
                      ? "text-white font-bold"
                      : "text-pink-100 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="max-w-[140px] truncate text-sm font-medium text-pink-100">
              {displayName}
            </span>
            <button
              onClick={handleLogout}
              title="Logout"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/30 text-white transition hover:bg-white/10"
            >
              <LogOut size={18} />
            </button>
          </div> */}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/30 text-white lg:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Dropdown Menu Mobile */}
      {open && (
        <>
          <button
            aria-hidden
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          />

          <nav className="fixed right-4 top-[90px] z-40 w-64 rounded-2xl border border-pink-100 bg-white py-2 shadow-xl lg:hidden">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium ${
                    active
                      ? "bg-pink-50 text-pink-700 font-semibold"
                      : "text-indigo-900 hover:bg-neutral-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}

            {/* <button
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-neutral-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button> */}
          </nav>
        </>
      )}
    </div>
  );
}