"use client";

import { useState } from "react";
import { UploadCloud, X, FileText } from "lucide-react";

interface FileUploadProps {
  onFileChange?: (file: File | null) => void;
}

export default function FileUpload({ onFileChange }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    onFileChange?.(selected);
  };

  const removeFile = () => {
    setFile(null);
    onFileChange?.(null);
  };

  return (
    <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm space-y-3">
      <h2 className="text-sm font-bold text-gray-800">
        Upload Evidence (Optional)
      </h2>

      {!file ? (
        <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-pink-300 bg-pink-50/40 p-6 text-center cursor-pointer transition hover:bg-pink-50/70">
          <UploadCloud className="mb-2 h-8 w-8 text-pink-500" />

          <p className="text-xs font-bold text-gray-700">
            Drag & drop files here
          </p>

          <p className="mt-0.5 text-[11px] text-gray-400">
            PNG, JPG, MP4 up to 20MB
          </p>

          <span className="mt-3 text-xs font-bold text-pink-600 underline hover:text-pink-700">
            Browse Files
          </span>

          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="rounded-xl border border-pink-200 bg-pink-50/30 p-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 truncate pr-2">
              <FileText className="h-4 w-4 text-pink-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-800 truncate max-w-[180px]">
                  {file.name}
                </p>
                <p className="text-[10px] text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <button
              onClick={removeFile}
              className="p-1 rounded-full text-gray-400 hover:bg-pink-100 hover:text-pink-600 transition"
              title="Remove File"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {file.type.startsWith("image/") && (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-full max-h-48 object-cover rounded-lg border border-pink-200"
            />
          )}

          {file.type.startsWith("video/") && (
            <video
              controls
              className="w-full max-h-48 rounded-lg border border-pink-200"
              src={URL.createObjectURL(file)}
            />
          )}
        </div>
      )}
    </div>
  );
}