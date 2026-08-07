"use client";

import { useState } from "react";
import { MapPin, Image as ImageIcon, Lock, Upload, X, CheckCircle2 } from "lucide-react";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imageFile) return;

    // Mock submission
    console.log({
      content,
      anonymous,
      imageFile: imageFile?.name,
    });

    // Reset form & trigger notification
    setContent("");
    setAnonymous(false);
    removeImage();
    setSuccessMessage(true);

    setTimeout(() => {
      setSuccessMessage(false);
    }, 4000);
  };

  return (
    <div className="rounded-[28px] border border-pink-200 bg-white p-5 sm:p-6 shadow-sm relative">
      {successMessage && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs sm:text-sm font-medium text-emerald-800 transition">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Success! Your safety update has been shared with the community.</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share a safety update or tip with your community..."
          rows={4}
          className="w-full resize-none border-b border-pink-100 pb-4 text-sm sm:text-base outline-none placeholder:text-pink-300 text-gray-800"
        />

        {/* Image Preview Box */}
        {imagePreview && (
          <div className="relative mt-4 w-full h-40 rounded-2xl overflow-hidden border border-gray-200 bg-neutral-100">
            <img src={imagePreview} alt="Upload preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Action Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs sm:text-sm text-purple-700 font-medium">
            <button
              type="button"
              className="flex items-center gap-1.5 hover:text-pink-600 transition cursor-pointer"
            >
              <MapPin className="h-4 w-4 text-purple-700" />
              <span>Location</span>
            </button>

            <label className="flex cursor-pointer items-center gap-1.5 hover:text-pink-600 transition">
              <ImageIcon className="h-4 w-4 text-purple-700" />
              <span>Media</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </label>

            <button
              type="button"
              onClick={() => setAnonymous(!anonymous)}
              className={`flex items-center gap-1.5 transition cursor-pointer ${
                anonymous ? "text-pink-600 font-semibold" : "hover:text-pink-600"
              }`}
            >
              <Lock className="h-4 w-4 text-purple-700" />
              <span>Anonymous</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={!content.trim() && !imageFile}
            className="flex items-center gap-2 rounded-xl bg-[#4C28BC] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#3D1F9E] transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </button>
        </div>
      </form>
    </div>
  );
}