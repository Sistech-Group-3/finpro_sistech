"use client";

import Link from "next/link";
import { useId } from "react";


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

export default function SisTraceLanding() {
  return (
    <div
      style={{
        background:
          "var(--background-pink, radial-gradient(50% 50% at 50% 50%, var(--Colors-Primary-100, #FAD5EE) 0%, var(--Colors-Primary-200, #F5ABDE) 100%))",
      }}
      className="relative min-h-screen w-full overflow-hidden flex flex-col"
    >      {/* Decorative background stars */}
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
      {/* Header */}
      <header className="relative z-10 flex items-center gap-3 bg-[#CC1893] px-5 py-4 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/30">
          <div className="h-6 w-6 rounded-md bg-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white leading-tight">SisTrace</h1>
          <p className="text-xs text-pink-100">Safety in Every Step</p>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        <span className="rounded-full bg-[#E62DAC] px-4 py-1.5 text-xs font-medium text-white shadow-sm">
          SisTrace by Group 3 | Final Project Sistech 2026
        </span>

        <h2 className="mt-6 text-3xl font-extrabold leading-tight text-[#E62DAC]">
          Your Safe Space on the Go
        </h2>

        <p className="mt-4 max-w-md text-sm leading-relaxed text-[#901167]">
          Never walk alone again. Sistrace helps women stay safe and avoid
          harassment through smart, community-driven safety features.
        </p>

        <div className="mt-10 flex w-full max-w-sm flex-col gap-4">
          <Link
            href="/register"
            className="w-full rounded-xl bg-[#432F9F] py-3.5 text-center text-base font-semibold text-white shadow-md transition-transform active:scale-[0.98]"
          >
            Register Now
          </Link>

          <Link
            href="/login"
            className="w-full rounded-xl bg-[#E62DAC] py-3.5 text-center text-base font-semibold text-white shadow-md transition-transform active:scale-[0.98]"
          >
            Log In
          </Link>
        </div>
      </div>

      <HelpCenterCard />
    </>
  );
}