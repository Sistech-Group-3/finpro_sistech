"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import LocationContext from "@/components/report/LocationContext";
import FileUpload from "@/components/report/FileUpload";
import ReportForm from "@/components/report/ReportForm";

export default function ReportPage() {
  // Shared state — lifted up so LocationContext & FileUpload can feed ReportForm
  const [file, setFile] = useState<File | null>(null);
  const [coords, setCoords] = useState<[number, number]>([-6.2088, 106.8456]);
  const [locationLabel, setLocationLabel] = useState<string>("");

  const handleLocationChange = (label: string, newCoords: [number, number]) => {
    setLocationLabel(label);
    setCoords(newCoords);
  };

  return (
    <div className="min-h-screen w-full bg-[#FBD9EC]">
      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-[9999]">
        <Navbar />
      </header>

      <main className="w-full flex justify-center pt-24 pb-10 px-4">
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="space-y-5 lg:col-span-5">
              <LocationContext onLocationChange={handleLocationChange} />
              <FileUpload onFileChange={setFile} />
            </div>

            <div className="lg:col-span-7">
              <ReportForm
                file={file}
                coords={coords}
                locationLabel={locationLabel}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}