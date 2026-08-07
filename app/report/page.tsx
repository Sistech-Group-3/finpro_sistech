import Navbar from "@/components/Navbar";
import LocationContext from "@/components/report/LocationContext";
import FileUpload from "@/components/report/FileUpload";
import ReportForm from "@/components/report/ReportForm";

export default function ReportPage() {
  return (
    <div className="min-h-screen w-full bg-[#FBD9EC]">
      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-[9999]">
        <Navbar />
      </header>

      {/* Page */}
      <main className="w-full flex justify-center pt-20 pb-10">
        <div className="w-full max-w-[430px] lg:max-w-5xl px-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="space-y-5 lg:col-span-5">
              <LocationContext />
              <FileUpload />
            </div>

            <div className="lg:col-span-7">
              <ReportForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}