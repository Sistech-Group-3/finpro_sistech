import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function HelpCenterCard() {
  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-[#F45FA6] to-[#C21C74] px-6 py-6 overflow-hidden">
      <h3 className="text-white font-extrabold text-xl relative z-10">
        Need More Help?
      </h3>
      <p className="text-pink-100 text-sm mb-4 relative z-10">Contact Us!</p>

      <Link
        href="/help-center"
        className="relative z-10 inline-flex items-center gap-2 rounded-lg bg-indigo-800 text-white text-sm font-semibold px-4 py-2.5 hover:bg-indigo-700 transition-colors"
      >
        <MessageCircle className="h-4 w-4" />
        Help Center
      </Link>
    </div>
  );
}