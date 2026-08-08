import Navbar from "@/components/Navbar";
import ProfileManagement from "@/components/settings/ProfileManagement";
import EmergencyContacts from "@/components/settings/EmergencyContacts";
import DangerZone from "@/components/settings/DangerZone";

export default function SettingsPage() {
  return (
    <div className="min-h-screen w-full bg-[#FBD9EC]">
      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-[9999]">
        <Navbar />
      </header>

      {/* Page */}
      <main className="w-full flex justify-center pt-20 pb-10 px-4">
        <div className="w-full max-w-[430px] lg:max-w-4xl flex flex-col gap-5">
          <ProfileManagement />
          <EmergencyContacts />
          <DangerZone />
        </div>
      </main>
    </div>
  );
}