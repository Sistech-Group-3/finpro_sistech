"use client"

import { useCallback, useEffect, useRef, useState } from "react";
import { Siren, MapPin, PhoneCall, ShieldCheck, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useEmergency } from "../hooks/use-emergency";
import type { TrustedContact } from "../types/emergency.types";

const HOLD_DURATION_MS = 2000;
const EMERGENCY_NUMBER = "112"; // swap for the correct local number

const CATEGORY_LABEL: Record<string, string> = {
  police: "Police",
  hospital: "Hospital",
  fire_station: "Fire station",
  shelter: "Shelter",
  pharmacy: "Pharmacy",
};

export default function Emergency() {
  const {
    activeEvent,
    safePoints,
    isTriggering,
    error,
    triggerSOS,
    endSOS,
    loadNearestSafePoints,
  } = useEmergency();

  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [holdProgress, setHoldProgress] = useState(0); // 0–100
  const [isHolding, setIsHolding] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const alarmRef = useRef<HTMLAudioElement | null>(null);

  // Load the signed-in user's trusted contacts once, for the quick-call list
  useEffect(() => {
    supabase
      .from("trusted_contacts")
      .select("*")
      .order("priority", { ascending: true })
      .then(({ data }) => setContacts(data ?? []));
  }, []);

  // Pre-fetch nearest safe points on mount so the map/list isn't empty before an SOS
  useEffect(() => {
    loadNearestSafePoints().catch(() => {
      /* silently ignore — permission may not be granted yet */
    });
  }, [loadNearestSafePoints]);

  // Alarm sound while an event is active
  useEffect(() => {
    if (activeEvent?.alarm_active) {
      alarmRef.current?.play().catch(() => {});
    } else {
      alarmRef.current?.pause();
      if (alarmRef.current) alarmRef.current.currentTime = 0;
    }
  }, [activeEvent?.alarm_active]);

  const cancelHold = useCallback(() => {
    setIsHolding(false);
    setHoldProgress(0);
    startRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const tickRef = useRef<(timestamp: number) => void>(() => {});

  useEffect(() => {
    tickRef.current = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(100, (elapsed / HOLD_DURATION_MS) * 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        cancelHold();
        triggerSOS().catch(() => {});
        return;
      }
      rafRef.current = requestAnimationFrame(tickRef.current);
    };
  }, [cancelHold, triggerSOS]);

  const beginHold = useCallback(() => {
    if (activeEvent) return; // already active, nothing to hold
    setIsHolding(true);
    startRef.current = null;
    rafRef.current = requestAnimationFrame(tickRef.current);
  }, [activeEvent]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const ringCircumference = 2 * Math.PI * 88;

  return (
    <div className="min-h-screen w-full text-neutral-100 flex flex-col items-center px-6 py-10">
      {/* Silent by default — a real alarm asset should replace this src */}
      {/* <audio ref={alarmRef} loop src="app/public/audio/alarm.mp3" /> */}

      <header className="w-full max-w-sm flex items-center justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Safety</p>
          <h1 className="text-lg font-semibold">Emergency SOS</h1>
        </div>
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            activeEvent ? "bg-red-500 animate-pulse" : "bg-emerald-500"
          }`}
          aria-label={activeEvent ? "SOS active" : "All clear"}
        />
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* HOLD-TO-ACTIVATE SOS BUTTON                                       */}
      {/* ---------------------------------------------------------------- */}
      <div className="relative flex flex-col items-center">
        <div className="relative h-52 w-52">
          <svg viewBox="0 0 192 192" className="absolute inset-0 -rotate-90">
            <circle cx="96" cy="96" r="88" fill="none" stroke="#262626" strokeWidth="8" />
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke={activeEvent ? "#ef4444" : "#dc2626"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringCircumference * (1 - holdProgress / 100)}
              style={{ transition: isHolding ? "none" : "stroke-dashoffset 150ms ease-out" }}
            />
          </svg>

          <button
            type="button"
            disabled={!!activeEvent || isTriggering}
            onPointerDown={beginHold}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            aria-label="Hold for 2 seconds to send an SOS alert"
            className="absolute inset-4 rounded-full bg-red-600 disabled:bg-red-900
                       flex flex-col items-center justify-center gap-2 select-none
                       shadow-[0_0_40px_rgba(220,38,38,0.35)]
                       active:scale-95 transition-transform
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400"
          >
            {isTriggering ? (
              <Loader2 className="h-9 w-9 animate-spin" />
            ) : (
              <Siren className="h-9 w-9" />
            )}
            <span className="text-sm font-semibold tracking-wide">
              {activeEvent ? "SOS ACTIVE" : isHolding ? "Keep holding…" : "Hold for SOS"}
            </span>
          </button>
        </div>

        <p className="mt-4 text-sm text-neutral-500 text-center max-w-[220px]">
          {activeEvent
            ? "Alarm sounding · SOS sent"
            : "Hold the button for 2 seconds to alert your trusted contacts and share your live location."}
        </p>

        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* ACTIVE-STATE CONTROLS                                             */}
      {/* ---------------------------------------------------------------- */}
      {activeEvent && (
        <div className="w-full max-w-sm mt-8 flex gap-3">
          <button
            onClick={() => endSOS("resolved")}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600
                       hover:bg-emerald-500 py-3 text-sm font-medium transition-colors"
          >
            <ShieldCheck className="h-4 w-4" /> I&apos;m safe now
          </button>
          <button
            onClick={() => endSOS("cancelled")}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-neutral-800
                       hover:bg-neutral-700 py-3 text-sm font-medium transition-colors"
          >
            <X className="h-4 w-4" /> Cancel — false alarm
          </button>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* QUICK-CALL SHORTCUTS                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="w-full max-w-sm mt-10">
        <h2 className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-3">Quick call</h2>
        <a
          href={`tel:${EMERGENCY_NUMBER}`}
          className="flex items-center gap-3 rounded-xl bg-neutral-900 border border-neutral-800
                     px-4 py-3 mb-2 hover:border-red-500/60 transition-colors"
        >
          <PhoneCall className="h-4 w-4 text-red-500" />
          <span className="text-sm">Emergency services ({EMERGENCY_NUMBER})</span>
        </a>
        {contacts.map((c) => (
          <a
            key={c.id}
            href={c.phone ? `tel:${c.phone}` : undefined}
            className="flex items-center justify-between gap-3 rounded-xl bg-neutral-900
                       border border-neutral-800 px-4 py-3 mb-2 hover:border-neutral-700 transition-colors"
          >
            <span className="flex items-center gap-3 text-sm">
              <PhoneCall className="h-4 w-4 text-neutral-400" />
              {c.name}
              {c.relationship && <span className="text-neutral-500">· {c.relationship}</span>}
            </span>
            {!c.phone && <span className="text-xs text-neutral-600">No number</span>}
          </a>
        ))}
        {contacts.length === 0 && (
          <p className="text-sm text-neutral-600">Add trusted contacts to enable quick-call.</p>
        )}
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* NEAREST SAFE POINTS                                               */}
      {/* ---------------------------------------------------------------- */}
      <section className="w-full max-w-sm mt-10 mb-8">
        <h2 className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-3">
          Nearest safe points
        </h2>
        {safePoints.length === 0 && (
          <p className="text-sm text-neutral-600">
            Enable location access to see nearby police, hospitals, and shelters.
          </p>
        )}
        {safePoints.map((sp) => (
          <div
            key={sp.id}
            className="flex items-start gap-3 rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-3 mb-2"
          >
            <MapPin className="h-4 w-4 text-neutral-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{sp.name}</p>
              <p className="text-xs text-neutral-500">
                {CATEGORY_LABEL[sp.category] ?? sp.category} · {sp.distance_km.toFixed(1)} km
              </p>
            </div>
            {sp.phone && (
              <a href={`tel:${sp.phone}`} className="text-xs text-red-400 shrink-0">
                Call
              </a>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}