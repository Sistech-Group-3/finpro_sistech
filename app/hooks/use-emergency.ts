import { useCallback, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type {
  EmergencyEvent,
  SafePoint,
  SafePointWithDistance,
  TrustedContact,
} from "../types/emergency.types";

interface Coords {
  latitude: number;
  longitude: number;
}

interface TriggerResult {
  event: EmergencyEvent;
  safe_points: SafePointWithDistance[];
}

const EARTH_RADIUS_KM = 6371;

// Fallback when the browser can't resolve a position (permission denied,
// timeout, unavailable) so SOS/nearest-safe-points still work instead of
// erroring out.
const FALLBACK_COORDS: Coords = { latitude: 41.8781, longitude: -87.6298 };

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function nearestSafePoints(coords: Coords): Promise<SafePointWithDistance[]> {
  const { data, error } = await supabase
    .from("safe_points")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;

  const points = (data as SafePoint[]).map((sp) => ({
    ...sp,
    distance_km: haversineKm(coords.latitude, coords.longitude, sp.latitude, sp.longitude),
  }));
  return points.sort((a, b) => a.distance_km - b.distance_km).slice(0, 5);
}

export function useEmergency() {
  const [activeEvent, setActiveEvent] = useState<EmergencyEvent | null>(null);
  const [safePoints, setSafePoints] = useState<SafePointWithDistance[]>([]);
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [isTriggering, setIsTriggering] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentPosition = useCallback((): Promise<Coords> => {
    return new Promise((resolve) => {
      if (!("geolocation" in navigator)) {
        resolve(FALLBACK_COORDS);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => resolve(FALLBACK_COORDS),
        { enableHighAccuracy: true, timeout: 10_000 }
      );
    });
  }, []);

  const triggerSOS = useCallback(
    async (note?: string): Promise<TriggerResult> => {
      setIsTriggering(true);
      setError(null);
      try {
        const coords = await getCurrentPosition();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) throw new Error("You must be signed in to send an SOS.");

        const { data, error: insertError } = await supabase
          .from("emergencies")
          .insert({
            latitude: coords.latitude,
            longitude: coords.longitude,
            note: note ?? null,
          })
          .select()
          .single();
        if (insertError) throw insertError;

        const event = data as EmergencyEvent;
        setActiveEvent(event);

        const points = await nearestSafePoints(coords);
        setSafePoints(points);

        return { event, safe_points: points };
      } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to trigger SOS";
        setError(message);
        throw e;
      } finally {
        setIsTriggering(false);
      }
    },
    [getCurrentPosition]
  );

  const endSOS = useCallback(
    async (outcome: "resolved" | "cancelled") => {
      if (!activeEvent) return;
      setIsEnding(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          const patch =
            outcome === "resolved"
              ? {
                  status: "resolved",
                  resolved_at: new Date().toISOString(),
                  alarm_active: false,
                }
              : {
                  status: "cancelled",
                  cancelled_at: new Date().toISOString(),
                  alarm_active: false,
                };

          const { error } = await supabase
            .from("emergencies")
            .update(patch)
            .eq("id", activeEvent.id);
          if (error) throw error;

          setActiveEvent(null);
          setSafePoints([]);
        }
      } finally {
        setIsEnding(false);
      }
    },
    [activeEvent]
  );

  const loadNearestSafePoints = useCallback(async () => {
    const coords = await getCurrentPosition();
    const points = await nearestSafePoints(coords);
    setSafePoints(points);
    return points;
  }, [getCurrentPosition]);

  const loadTrustedContacts = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setContacts([]);
        return [];
      }
      const { data, error } = await supabase
        .from("trusted_contacts")
        .select("*")
        .eq("user_id", user.id)
        .order("priority", { ascending: true });
      if (error) throw error;
      const list = (data ?? []) as TrustedContact[];
      setContacts(list);
      return list;
    } catch {
      setContacts([]);
      return [];
    }
  }, []);

  return {
    activeEvent,
    safePoints,
    contacts,
    isTriggering,
    isEnding,
    error,
    triggerSOS,
    endSOS,
    loadNearestSafePoints,
    loadTrustedContacts,
  };
}
