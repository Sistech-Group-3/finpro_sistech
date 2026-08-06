"use client";

type AnonymousToggleProps = {
  isAnonymous: boolean;
  setIsAnonymous: (value: boolean) => void;
};

export default function AnonymousToggle({
  isAnonymous,
  setIsAnonymous,
}: AnonymousToggleProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-purple-300 bg-purple-50/40 p-3.5 sm:p-4">
      <div className="space-y-0.5">
        <h3 className="text-xs sm:text-sm font-bold text-[#6B21A8]">
          Submit Anonymously
        </h3>
        <p className="text-[11px] sm:text-xs text-purple-900/70">
          Hide my identity from the public feed
        </p>
      </div>

      {/* Switch Toggle Button */}
      <button
        type="button"
        role="switch"
        aria-checked={isAnonymous}
        onClick={() => setIsAnonymous(!isAnonymous)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 ${
          isAnonymous ? "bg-[#6B21A8]" : "bg-gray-300"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            isAnonymous ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}