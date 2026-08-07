import Navbar from "@/components/Navbar";
import LocationCard from "@/components/LocationCard";
import FeedsCarousel from "@/components/FeedsCarousel";
import CategoryGrid from "@/components/CategoryGrid";
import HelpCenterCard from "@/components/HelpCenterCard";

export default function DashboardPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen w-full bg-[#FBD9EC] flex justify-center pt-[92px] pb-10 px-4 sm:px-6">
        <div className="w-full max-w-[430px] lg:max-w-2xl space-y-4 sm:space-y-5">
          <LocationCard />
          <FeedsCarousel />
          <CategoryGrid />
          <HelpCenterCard />
        </div>
      </main>
    </>
  );
}
