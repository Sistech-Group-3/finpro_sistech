"use client";

import Link from "next/link";
import { useId } from "react";
import { ChevronLeft } from "lucide-react";

function Star({
  className,
  color = "#6952CC",
}: {
  className?: string;
  color?: string;
}) {
  const uid = useId();
  const filterId = `star-blur-${uid}`;

  return (
    <svg
      width="160"
      height="158"
      viewBox="0 0 252.915 250.101"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g filter={`url(#${filterId})`}>
        <path
          d="M134.958 74.2461L135.758 74.9853L207.449 34.7596L173.55 108.452L173.094 109.442L173.895 110.181L233.503 165.192L152.944 155.725L151.862 155.598L151.406 156.588L117.506 230.278L101.617 150.736L101.404 149.668L100.321 149.54L19.7607 140.072L91.4506 99.8463L91.2374 98.7778L75.3478 19.2336L134.958 74.2461Z"
          stroke={color}
          strokeWidth="3"
        />
      </g>
      <defs>
        <filter
          id={filterId}
          x="0"
          y="0"
          width="252.915"
          height="250.101"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="7.5" result="effect1_foregroundBlur_7_434" />
        </filter>
      </defs>
    </svg>
  );
}

export default function SisTraceRegister() {
  return (
    <div
      style={{
        background:
          "var(--background-pink, radial-gradient(50% 50% at 50% 50%, var(--Colors-Primary-100, #FAD5EE) 0%, var(--Colors-Primary-200, #F5ABDE) 100%))",
      }}
      className="relative min-h-screen w-full overflow-hidden flex flex-col"
    >
      {/* Decorative background stars */}
       <Star
        color="#E62DAC"
        className="absolute -left-[70px] top-[200px] h-40 w-40 rotate-[-12deg]
                  lg:-left-[40px] lg:top-[70px] lg:h-50 lg:w-50 lg:rotate-[-8deg]"
      />
      <Star
        color="#6952CC"
        className="absolute -right-[80px] top-[-1px] h-60 w-60 rotate-[-0deg]
                  lg:-right-[60px] lg:top-[-1px] lg:h-80 lg:w-80"
      />
      <Star
        color="#6952CC"
        className="absolute -left-[80px] bottom-[-1px] h-60 w-60 rotate-[0deg]
                  lg:-left-[80px] lg:bottom-[-80px] lg:h-80 lg:w-80"
      />
      <Star
        color="#E62DAC"
        className="absolute -right-[70px] bottom-[180px] h-40 w-40 rotate-[12deg]
                  lg:-right-[40px] lg:bottom-[10px] lg:h-50 lg:w-50 lg:rotate-[8deg]"
      />

      {/* Back button */}
      <div className="relative z-10 px-5 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 bg-[#E62DAC] px-4 py-2 text-sm font-medium text-white shadow-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali
        </Link>
      </div>

      {/* Card */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-10 pt-8">
        <div className="w-full max-w-sm overflow-hidden rounded-sm shadow-xl">
          {/* Card header */}
          <div className="flex items-center gap-3 bg-[#CC1893] px-6 py-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-white/30">
              <div className="h-6 w-6 rounded-sm bg-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">
                SisTrace
              </h1>
              <p className="text-xs text-pink-100">Safety in Every Step</p>
            </div>
          </div>

          {/* Card body */}
          <div className="bg-[#AE147D] px-6 pb-6 pt-8 text-center">
            <h2 className="text-2xl font-bold leading-tight text-white">
              Mulai Langkahmu di Sini
            </h2>
            <p className="mt-2 text-xs text-pink-100">
              Teruskan persiapanmu menuju tahap selanjutnya!
            </p>

            <form className="mt-6 space-y-4 text-left">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white">
                  Nama
                </label>
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  className="w-full rounded-sm border-0 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E62DAC]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-white">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-sm border-0 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E62DAC]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-white">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-sm border-0 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E62DAC]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-white">
                  Re-Enter Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-sm border-0 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E62DAC]"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-xs bg-[#E62DAC] py-3.5 text-center text-base font-semibold text-white shadow-md transition-transform active:scale-[0.98]"
              >
                Masuk
              </button>
            </form>
          </div>
        </div>

        <p className="mt-6 text-sm text-[#901167]">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-bold text-[#E62DAC]">
            Masuk Sekarang
          </Link>
        </p>
      </main>
    </div>
  );
}