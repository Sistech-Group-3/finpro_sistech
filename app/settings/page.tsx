import Navbar from "@/components/Navbar";
import ProfileManagement from "@/components/settings/ProfileManagement";
import EmergencyContacts from "@/components/settings/EmergencyContacts";
import RouteConfiguration from "@/components/settings/RouteConfiguration";
import DangerZone from "@/components/settings/DangerZone";

export default function SettingsPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen px-4">
        <div className="mx-auto flex w-full max-w-[430px] flex-col gap-5 lg:max-w-4xl">
          <ProfileManagement />
          <EmergencyContacts />
          <RouteConfiguration />
          <DangerZone />
        </div>
      </main>
    </>
  );
}