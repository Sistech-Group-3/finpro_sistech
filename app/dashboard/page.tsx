import LocationCard from "@/components/LocationCard";
import FeedsCarousel from "@/components/FeedsCarousel";
import CategoryGrid from "@/components/CategoryGrid";
import HelpCenterCard from "@/components/HelpCenterCard";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pt-3 pb-6 sm:px-6 sm:pt-6 lg:px-8 flex flex-col gap-5 sm:gap-6">
      <LocationCard />
      <FeedsCarousel />
      <CategoryGrid />
      <HelpCenterCard />
    </main>
  );
}