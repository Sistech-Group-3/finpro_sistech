import LocationContext from "@/components/report/LocationContext";
import FileUpload from "@/components/report/FileUpload";
import ReportForm from "@/components/report/ReportForm";

export default function ReportPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <LocationContext />
          <FileUpload />
        </div>

        <div className="lg:col-span-7">
          <ReportForm />
        </div>
      </div>
    </div>
  );
}