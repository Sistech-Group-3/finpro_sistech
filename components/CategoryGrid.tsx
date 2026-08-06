import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  label: string;
  icon: LucideIcon;
  href: string;
}

export default function CategoryGrid({ label, icon: Icon, href }: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="rounded-2xl bg-pink-50/80 hover:bg-pink-50 transition-colors px-4 py-4 flex items-center gap-3 border border-dashed border-indigo-300/60"
    >
      <div className="h-9 w-9 rounded-lg bg-indigo-800 flex items-center justify-center shrink-0">
        <Icon className="h-4.5 w-4.5 text-white" />
      </div>
      <span className="font-semibold text-indigo-900 text-[15px] leading-tight">
        {label}
      </span>
    </Link>
  );
}