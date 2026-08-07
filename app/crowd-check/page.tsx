"use client";

import { useState } from "react";

import Navbar from "@/components/Navbar";

import LocationSearch, {
  LocationResult,
} from "@/components/crowd-check/LocationSearch";
import dynamic from "next/dynamic";
import CrowdReporting from "@/components/crowd-check/CrowdReporting";
import RecentReports from "@/components/crowd-check/RecentReports";

import type {
  CrowdLevel,
  CrowdReport,
} from "@/components/crowd-check/types";

const DEFAULT_LOCATION: LocationResult = {
  displayName: "Chicago, IL, USA",
  lat: 41.8781,
  lon: -87.6298,
};

async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      lat: latitude.toString(),
      lon: longitude.toString(),
      format: "json",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Reverse geocoding failed: ${response.status}`
      );
    }

    const data = await response.json();

    return data?.display_name ?? null;
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return null;
  }
}

export default function CrowdCheckPage() {
  const [selectedLocation, setSelectedLocation] =
    useState<LocationResult>(DEFAULT_LOCATION);

  const [currentLocation, setCurrentLocation] = useState(
    "Jl. Merdeka No. 10, Malang"
  );

  const [reportLevel, setReportLevel] =
    useState<CrowdLevel>("High");

  const [reports, setReports] = useState<CrowdReport[]>([]);
  const [sending, setSending] = useState(false);
  const [sentToast, setSentToast] = useState(false);

  /**
   * Dipanggil ketika user klik langsung di peta.
   *
   * Flow:
   * klik peta
   * → dapat latitude & longitude
   * → reverse geocoding
   * → update selectedLocation
   * → update Current Location
   */
  const handleMapLocationSelect = async (
    latitude: number,
    longitude: number
  ) => {
    // Update posisi marker/map terlebih dahulu.
    setSelectedLocation({
      displayName: "Mencari alamat...",
      lat: latitude,
      lon: longitude,
    });

    // Reverse geocoding menggunakan Nominatim.
    const address = await reverseGeocode(
      latitude,
      longitude
    );

    const finalAddress =
      address ??
      `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

    // Update lokasi yang dipilih.
    setSelectedLocation({
      displayName: finalAddress,
      lat: latitude,
      lon: longitude,
    });

    // Masukkan alamat ke Current Location.
    setCurrentLocation(finalAddress);
  };

  const CrowdMap = dynamic(
  () =>
    import("@/components/crowd-check/CrowdMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[340px] w-full rounded-2xl bg-gray-100 flex items-center justify-center">
        Loading map...
      </div>
    ),
  }
);

  /**
   * Dipanggil ketika user memilih hasil dari search.
   *
   * Search location juga harus otomatis mengisi
   * Current Location.
   */

  const handleSearchLocationSelect = (
    location: LocationResult
  ) => {
    setSelectedLocation(location);
    setCurrentLocation(location.displayName);
  };

  const handleSendReport = () => {
    if (!currentLocation.trim()) return;

    setSending(true);

    setTimeout(() => {
      const newReport: CrowdReport = {
        id: Math.random().toString(36).slice(2),
        location: currentLocation,
        level: reportLevel,
        timestamp:
          new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }) + " WIB",
      };

      setReports((prev) => [
        newReport,
        ...prev,
      ]);

      setSending(false);
      setSentToast(true);

      setTimeout(() => {
        setSentToast(false);
      }, 2500);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#FBD9EC]">
      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-[9999]">
        <Navbar />
      </header>

      {/* Page */}
      <main className="w-full flex justify-center pt-20 pb-10">
        <div className="w-full max-w-[430px]">
          <div className="px-5">
            {/* Search Location */}
            <LocationSearch
              selectedLocation={selectedLocation}
              onSelect={handleSearchLocationSelect}
            />

            {/* Leaflet Map */}
            <CrowdMap
              latitude={selectedLocation.lat}
              longitude={selectedLocation.lon}
              onLocationSelect={
                handleMapLocationSelect
              }
            />

            {/* Crowd Reporting */}
            <CrowdReporting
              currentLocation={currentLocation}
              reportLevel={reportLevel}
              onLocationChange={setCurrentLocation}
              onReportLevelChange={setReportLevel}
              onSendReport={handleSendReport}
              sending={sending}
              sentToast={sentToast}
            />

            {/* Recent Reports */}
            <RecentReports reports={reports} />
          </div>
        </div>
      </main>
    </div>
  );
}