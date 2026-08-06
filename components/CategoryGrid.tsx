import Link from "next/link";
import {
  LucideIcon,
  Navigation,
  FileText,
  AlertTriangle,
  Users,
} from "lucide-react";

interface Category {
  label: string;
  icon: LucideIcon;
  href: string;
}

const CATEGORIES: Category[] = [
  {
    label: "Safe Route",
    icon: Navigation,
    href: "/safe-route",
  },
  {
    label: "Report",
    icon: FileText,
    href: "/anonymous-report",
  },
  {
    label: "Emergency",
    icon: AlertTriangle,
    href: "/emergency",
  },
  {
    label: "Crowd Check",
    icon: Users,
    href: "/crowd-check",
  },
];

export default function CategoryGrid() {
  return (
    <div>
      <h2 className="font-bold text-[#5B1242] mb-3 text-sm">
        Category
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {CATEGORIES.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-[10px] bg-[#FAD5EE] hover:bg-[#F8C4E6] transition-all pt-[12px] pb-[11px] pl-[12px] pr-[16px] sm:pr-[24px] flex items-center gap-[12px] shadow-sm"
          >
            <div className="h-8 w-8 rounded-[8px] bg-[#3B1578] flex items-center justify-center shrink-0">
              <Icon className="h-4 w-4 text-white" />
            </div>

            <span className="font-bold text-[#3B1578] text-xs sm:text-sm leading-none truncate">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}