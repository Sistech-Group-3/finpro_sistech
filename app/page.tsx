import LocationCard from "@/components/LocationCard";
import FeedsCarousel from "@/components/FeedsCarousel";
import CategoryGrid from "@/components/CategoryGrid";
import HelpCenterCard from "@/components/HelpCenterCard";
import { Route, FileWarning, ShieldAlert, Users } from "lucide-react";
import Emergency from "./test-db/emergency";

const CATEGORIES = [
  { label: "Safe Route", icon: Route, href: "/safe-route" },
  { label: "Report", icon: FileWarning, href: "/anonymous-report" },
  { label: "Emergency", icon: ShieldAlert, href: "/emergency" },
  { label: "Crowd Check", icon: Users, href: "/crowd-check" },
];

export default function DashboardPage() {
  return (
    <>
      <LocationCard />
      <FeedsCarousel />
      <Emergency />

      <div>
        <h2 className="font-bold text-indigo-900 mb-3">Category</h2>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => (
            <CategoryGrid key={cat.label} {...cat} />
          ))}
        </div>
      </div>

      <HelpCenterCard />
    </>
  );
}