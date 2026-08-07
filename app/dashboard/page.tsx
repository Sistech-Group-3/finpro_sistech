import Navbar from "@/components/Navbar";
import LocationCard from "@/components/LocationCard";
import FeedsCarousel from "@/components/FeedsCarousel";
import CategoryGrid from "@/components/CategoryGrid";
import HelpCenterCard from "@/components/HelpCenterCard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full bg-[#FBD9EC]">
      <header className="fixed inset-x-0 top-0 z-[9999]">
        <Navbar />
      </header>

      <main className="flex w-full justify-center pt-24 pb-10">
        <div className="w-full max-w-[430px] lg:max-w-3xl">
          <div className="px-5 space-y-4">
            <LocationCard />
            <FeedsCarousel />
            <CategoryGrid />
            <HelpCenterCard />
          </div>
        </div>
      </main>
    </div>
  );
}