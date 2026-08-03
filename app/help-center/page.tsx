import Link from "next/link";
import { ArrowLeft, MessageCircle, Phone, Mail, HelpCircle } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "How do I submit an anonymous report?",
    answer:
      "Open the Anonymous Report menu from navigation, fill in the incident details, then submit. Your identity will not be stored or shared.",
  },
  {
    question: "What is the Safe Route feature?",
    answer:
      "Safe Route helps you find safer travel routes based on community data and reports of high-risk areas.",
  },
  {
    question: "When should I use the Emergency button?",
    answer:
      "Use the Emergency button when you feel in immediate danger and need fast assistance.",
  },
  {
    question: "Is my location data safe?",
    answer:
      "Yes, your location is only used to show relevant nearby information and is never shared with third parties without consent.",
  },
];

export default function HelpCenterPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-indigo-900 font-semibold text-sm hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div>
        <h1 className="font-extrabold text-2xl text-indigo-900 mb-1">
          Help Center
        </h1>
        <p className="text-indigo-900/70 text-sm">
          We are here to help whenever you need it.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a
          href="tel:+6280000000"
          className="rounded-2xl bg-pink-50/80 hover:bg-pink-50 transition-colors px-4 py-4 flex items-center gap-3 border border-dashed border-indigo-300/60"
        >
          <div className="h-9 w-9 rounded-lg bg-indigo-800 flex items-center justify-center shrink-0">
            <Phone className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-indigo-900 text-[15px] leading-tight">
            Call
          </span>
        </a>

        <a
          href="mailto:support@sistrace.app"
          className="rounded-2xl bg-pink-50/80 hover:bg-pink-50 transition-colors px-4 py-4 flex items-center gap-3 border border-dashed border-indigo-300/60"
        >
          <div className="h-9 w-9 rounded-lg bg-indigo-800 flex items-center justify-center shrink-0">
            <Mail className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-indigo-900 text-[15px] leading-tight">
            Email
          </span>
        </a>
      </div>

      <div>
        <h2 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-pink-600" />
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl bg-pink-50/80 px-4 py-4 border border-pink-100"
            >
              <p className="font-semibold text-indigo-900 text-sm mb-1">
                {item.question}
              </p>
              <p className="text-indigo-900/70 text-sm leading-relaxed">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-[#F45FA6] to-[#C21C74] px-6 py-6">
        <h3 className="text-white font-extrabold text-lg mb-1">
          Still need help?
        </h3>
        <p className="text-pink-100 text-sm mb-4">
          Our team is ready to respond as quickly as possible.
        </p>
        <a
          href="mailto:support@sistrace.app"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-800 text-white text-sm font-semibold px-4 py-2.5 hover:bg-indigo-700 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          Contact Us
        </a>
      </div>
    </div>
  );
}