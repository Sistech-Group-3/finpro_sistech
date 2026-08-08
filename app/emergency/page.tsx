"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";
import {
  MapPin,
  Loader2,
  CheckCircle2,
  XCircle,
  ShieldAlert,
} from "lucide-react";
import SOSButton from "@/components/sos/SOSButton";
import EmergencyContacts, {
  type EmergencyContact,
} from "@/components/sos/EmergencyContacts";
import { TrustedContact } from "../types/emergency.types";
import { useEmergency } from "@/app/hooks/use-emergency";
import { useAuth } from "@/components/auth-provider";
import { reverseGeocode } from "@/lib/geocode";

const SafePointMap = dynamic(() => import("@/components/sos/SafePointMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 w-full items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-400">
      Loading map...
    </div>
  ),
});

type LatLng = [number, number];

const DEFAULT_USER_LOCATION: LatLng = [-6.2088, 106.8456];
const ALARM_SRC = "/audios/alarm.mp3";
const ALARM_DURATION_MS = 100_000;

// Dummy contacts used as a fallback so the UI has something to show
// before real trusted_contacts are loaded (e.g. during dev/demo, or if
// the user hasn't added any contacts yet).
const DUMMY_CONTACTS: EmergencyContact[] = [
  {
    id: "dummy-1",
    initials: "MJ",
    name: "Mark Jenkins",
    relation: "Husband",
    email: "akiraverse.id@gmail.com",
    role: "Primary Responder",
  },
  {
    id: "dummy-2",
    initials: "LS",
    name: "Linda Smith",
    relation: "Mother",
    email: "akiraverse.id@gmail.com",
    role: "Secondary Responder",
  },
];

export default function SOSPage() {
  const { loading: authLoading } = useAuth();
  const {
    activeEvent,
    safePoints,
    contacts,
    isTriggering,
    isEnding,
    error,
    triggerSOS,
    endSOS,
    loadNearestSafePoints,
    loadTrustedContacts,
    addTrustedContact,
    isAddingContact,
  } = useEmergency();

  const [userLocation, setUserLocation] = useState<LatLng>(DEFAULT_USER_LOCATION);
  const [address, setAddress] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const alarmTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopAlarm = useCallback(() => {
    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current);
      alarmTimeoutRef.current = null;
    }
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  const playAlarm = useCallback(() => {
    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio(ALARM_SRC);
      audio.loop = true;
      audioRef.current = audio;
    }
    audio.currentTime = 0;
    audio.play().catch(() => {});
    if (alarmTimeoutRef.current) clearTimeout(alarmTimeoutRef.current);
    alarmTimeoutRef.current = setTimeout(stopAlarm, ALARM_DURATION_MS);
  }, [stopAlarm]);

  useEffect(() => {
    loadTrustedContacts();
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          loadNearestSafePoints().catch(() => {});
        },
        () => {
          loadNearestSafePoints().catch(() => {});
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      loadNearestSafePoints().catch(() => {});
    }
  }, [loadTrustedContacts, loadNearestSafePoints]);

  // Stop the alarm when the SOS ends (resolved/cancelled) or on unmount.
  useEffect(() => {
    if (!activeEvent) stopAlarm();
    return stopAlarm;
  }, [activeEvent, stopAlarm]);

  const handleSOSTrigger = useCallback(async () => {
    setSending(true);
    try {
      const result = await triggerSOS();
      setUserLocation([result.event.latitude, result.event.longitude]);
      const addr = await reverseGeocode(
        result.event.latitude,
        result.event.longitude
      );
      setAddress(addr);
      playAlarm();
    } catch (e) {
      console.error("SOS trigger failed:", e);
    } finally {
      setSending(false);
    }
  }, [triggerSOS, playAlarm]);

  const handleEndSOS = async (outcome: "resolved" | "cancelled") => {
    try {
      await endSOS(outcome);
    } catch (e) {
      console.error("End SOS failed:", e);
    }
  };

  const nearestSafePoint = safePoints[0] ?? null;
  const mapSafePoint: LatLng = nearestSafePoint
    ? [nearestSafePoint.latitude, nearestSafePoint.longitude]
    : userLocation;
  const mapSafePointLabel = nearestSafePoint
    ? (nearestSafePoint.address ?? nearestSafePoint.name)
    : "Lokasi Kamu";

  const emergencyContacts: EmergencyContact[] =
    contacts.length > 0
      ? contacts.map((c) => ({
          id: c.id,
          name: c.name,
          initials: c.name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
          phone: c.phone ?? "",
          email: c.email ?? "",
          relation: c.relationship ?? "",
          role: c.role ?? "",
        }))
      : DUMMY_CONTACTS;

  const handleAddContact = async (contact: {
    name: string;
    relation?: string;
    role?: string;
    phone?: string;
    email?: string;
  }) => {
    try {
      await addTrustedContact(contact);
    } catch (e) {
      console.error("Add contact failed:", e);
    }
  };

  const handleSendLocation = (contact: EmergencyContact) => {
    const loc = activeEvent
      ? [activeEvent.latitude, activeEvent.longitude]
      : userLocation;
    const mapsUrl = `https://maps.google.com/?q=${loc[0]},${loc[1]}`;

    if (!contact.email) {
      console.error(`No email on file for ${contact.name}`);
      return;
    }

    const subject = "SOS! I need help";
    const body = [
      "SOS! I need help.",
      address ? `Address: ${address}` : null,
      `Location: ${mapsUrl}`,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `mailto:${contact.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`,
      "_blank"
    );
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#432F9F]" />
      </div>
    );
  }

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

          <div className="mt-8 flex flex-col items-center gap-4">
            <SOSButton
              onTrigger={handleSOSTrigger}
              triggered={Boolean(activeEvent)}
              disabled={sending || isTriggering}
            />

            {isTriggering && (
              <p className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-[#432F9F]" />
                Mengirim sinyal SOS...
              </p>
            )}

            {error && !activeEvent && (
              <p className="w-full max-w-md rounded-xl bg-red-100 px-4 py-2 text-center text-sm font-medium text-red-700">
                {error}
              </p>
            )}

            {activeEvent && (
              <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-5">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600"></span>
                  </span>
                  <h2 className="flex items-center gap-1.5 text-base font-bold text-red-700">
                    <ShieldAlert className="h-4 w-4" />
                    SOS Aktif
                  </h2>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-red-700">
                  Alarm berbunyi dan lokasimu sedang dibagikan ke kontak
                  darurat.
                  {address && (
                    <>
                      {" "}
                      Alamat: <span className="font-semibold">{address}</span>
                    </>
                  )}
                </p>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleEndSOS("resolved")}
                    disabled={isEnding}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98] disabled:opacity-60"
                  >
                    {isEnding ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    Aku Aman
                  </button>
                  <button
                    onClick={() => handleEndSOS("cancelled")}
                    disabled={isEnding}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-500 py-3 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98] disabled:opacity-60"
                  >
                    <XCircle className="h-4 w-4" />
                    Batalkan
                  </button>
                </div>
              </div>
            )}
          </div>

          <h2 className="mt-10 text-lg font-bold text-[#432F9F]">
            Your Nearest Safe Point
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-[#E62DAC]">
            <MapPin className="h-3.5 w-3.5" />
            {mapSafePointLabel}
          </p>

          <div className="mt-3">
            <SafePointMap userLocation={userLocation} safePoint={mapSafePoint} />
          </div>
        </div>

        <div className="mt-4 mx-4">
          <EmergencyContacts
            contacts={emergencyContacts}
            onSendLocation={handleSendLocation}
            onAddContact={handleAddContact}
            isAddingContact={isAddingContact}
          />
        </div>
      </main>
    </div>
  );
}