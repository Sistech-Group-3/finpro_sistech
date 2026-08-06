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
        suppressHydrationWarning
        className={`${montserrat.className} bg-gradient-to-b from-[#F8B8DD] to-[#FBD9EE] min-h-screen`}
      >
        <Navbar />

        <main className="mx-auto max-w-5xl px-4 pt-[108px] sm:pt-[112px] lg:pt-[96px] pb-8 sm:px-6 lg:px-8 space-y-6">
          {children}
        </main>
      </body>
    </html>
  );
}