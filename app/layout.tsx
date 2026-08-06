import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "SisTrace — Safety in Every Step",
  description:
    "Women safety platform: safe routes, anonymous reporting, and emergency support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} bg-gradient-to-b from-[#F8B8DD] to-[#FBD9EE] min-h-screen`}
      >
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 lg:px-8 xl:px-10 py-6 space-y-8">
          {children}
        </main>
      </body>
    </html>
  );
}