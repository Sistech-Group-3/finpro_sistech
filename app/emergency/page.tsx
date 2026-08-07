"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import SOSButton from "@/components/sos/SOSButton";
import EmergencyContacts, {
  type EmergencyContact,
} from "@/components/sos/EmergencyContacts";

const SafePointMap = dynamic(() => import("@/components/sos/SafePointMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 w-full items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-400">
      Loading map...
    </div>
  ),
});

type LatLng = [number, number];

const DEFAULT_USER_LOCATION: LatLng = [41.8781, -87.6298];
const DEFAULT_SAFE_POINT: LatLng = [41.8796, -87.6237];
const DEFAULT_SAFE_POINT_LABEL = "State St, Chicago, IL";

const MOCK_CONTACTS: EmergencyContact[] = [
  { id: "1", name: "Mark Jenkins", initials: "MJ" },
  { id: "2", name: "Linda Smith", initials: "LS" },
];

async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    const data = await res.json();
    return data?.display_name ?? null;
  } catch (err) {
    console.error("Reverse geocoding failed:", err);
    return null;
  }
}

export default function SOSPage() {
  const [userLocation, setUserLocation] = useState<LatLng>(DEFAULT_USER_LOCATION);
  const [safePoint] = useState<LatLng>(DEFAULT_SAFE_POINT);
  const [safePointLabel] = useState(DEFAULT_SAFE_POINT_LABEL);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (err) => {
        console.error("Geolocation error:", err);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleSOSTrigger = () => {
    console.log("SOS triggered at", userLocation);
    reverseGeocode(userLocation[0], userLocation[1]).then((address) => {
      console.log("Sharing location with emergency contacts:", address ?? userLocation);
    });
  };

  const handleSendLocation = (contact: EmergencyContact) => {
    console.log(`Sending current location to ${contact.name}`, userLocation);
  };

  return (
    <div className="relative min-h-screen w-full">
      <Navbar />
      
      {/* Main container diberikan pt-24 agar tidak tersembunyi di balik Navbar fixed */}
      <main
        style={{
          background:
            "var(--background-pink, radial-gradient(50% 50% at 50% 50%, var(--Colors-Primary-100, #FAD5EE) 0%, var(--Colors-Primary-200, #F5ABDE) 100%))",
        }}
        className="min-h-screen w-full pt-24 pb-8"
      >
        <div className="mx-4 rounded-3xl bg-pink-100/70 p-6">
          <h1 className="text-2xl font-bold text-[#432F9F]">Emergency (SOS)</h1>
          <p className="mt-2 text-sm text-slate-500">
            Press the SOS button for 2 second to fire the alarm and system will
            automatically share your location to your emergency contact.
          </p>

          <div className="mt-8 flex justify-center">
            <SOSButton onTrigger={handleSOSTrigger} />
          </div>

          <h2 className="mt-10 text-lg font-bold text-[#432F9F]">Your Nearest Safe Point</h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-[#E62DAC]">
            <MapPin className="h-3.5 w-3.5" />
            {safePointLabel}
          </p>

          <div className="mt-3">
            <SafePointMap userLocation={userLocation} safePoint={safePoint} />
          </div>
        </div>

        <div className="mt-4 mx-4">
          <EmergencyContacts contacts={MOCK_CONTACTS} onSendLocation={handleSendLocation} />
        </div>
      </main>
    </div>
  );
}