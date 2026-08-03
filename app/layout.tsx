import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "SisTrace - Safety in Every Step",
  description: "Women safety platform: safe routes, anonymous reporting, and emergency support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen w-full flex justify-center bg-neutral-900 py-6">
          <div className="w-full max-w-[430px] min-h-[778px] rounded-[28px] overflow-hidden shadow-2xl bg-gradient-to-b from-[#F8B8DD] to-[#FBD9EE] flex flex-col">
            <Navbar />

            <div className="flex-1 px-6 -mt-4 space-y-6 pb-8">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}