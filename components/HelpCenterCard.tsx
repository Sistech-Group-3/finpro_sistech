"use client";

import { MessageCircle } from "lucide-react";

interface HelpCenterCardProps {
  onContactClick?: () => void;
}

export default function HelpCenterCard({ onContactClick }: HelpCenterCardProps) {
  function handleClick() {
    if (onContactClick) {
      onContactClick();
    } else {
      alert("Coming soon!");
    }
  }

  return (
    <div className="relative rounded-[10px] bg-gradient-to-r from-[#F075C4] to-[#E748B4] p-5 sm:p-6 overflow-hidden shadow-sm">
      <h3 className="text-white font-bold text-lg sm:text-xl">
        Need More Help?
      </h3>
      <p className="text-pink-100 text-xs sm:text-sm mb-4 font-medium">
        Contact Us!
      </p>

      <button
        onClick={handleClick}
        className="flex items-center gap-2 rounded-xl bg-[#3B1578] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 hover:bg-[#2F1061] transition-colors active:scale-95"
      >
        <MessageCircle className="h-4 w-4" />
        Help Center
      </button>
    </div>
  );
}