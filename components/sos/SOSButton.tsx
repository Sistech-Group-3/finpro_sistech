"use client";

import { useRef, useState } from "react";
import { Navigation } from "lucide-react";

const HOLD_DURATION_MS = 2000;

interface SOSButtonProps {
  onTrigger: () => void;
  triggered?: boolean;
  disabled?: boolean;
}

export default function SOSButton({
  onTrigger,
  triggered = false,
  disabled = false,
}: SOSButtonProps) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0); // 0-100

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startHold = () => {
    if (triggered || disabled) return;
    setHolding(true);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / HOLD_DURATION_MS) * 100, 100);
      setProgress(pct);

      if (elapsed >= HOLD_DURATION_MS) {
        clearTimer();
        setHolding(false);
        setProgress(0);
        onTrigger();
      }
    }, 30);
  };

  const cancelHold = () => {
    clearTimer();
    setHolding(false);
    setProgress(0);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onMouseDown={startHold}
        onMouseUp={cancelHold}
        onMouseLeave={cancelHold}
        onTouchStart={startHold}
        onTouchEnd={cancelHold}
        aria-label="Hold for 2 seconds to trigger SOS alarm"
        className={`relative flex h-56 w-56 select-none flex-col items-center justify-center rounded-full text-white shadow-2xl transition-transform ${
          triggered
            ? "bg-red-800 animate-pulse"
            : holding
              ? "bg-red-600 scale-95"
              : "bg-red-600"
        } ${disabled && !triggered ? "cursor-not-allowed opacity-70" : ""}`}
      >
        {/* Progress ring while holding */}
        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 224 224">
          <circle
            cx="112"
            cy="112"
            r="106"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="6"
          />
          {holding && (
            <circle
              cx="112"
              cy="112"
              r="106"
              fill="none"
              stroke="white"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 106}
              strokeDashoffset={2 * Math.PI * 106 * (1 - progress / 100)}
            />
          )}
        </svg>

        <Navigation className="h-9 w-9 rotate-45" />
        <span className="mt-2 text-2xl font-bold">SOS</span>
      </button>
    </div>
  );
}
