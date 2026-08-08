import type { LatLng } from "@/components/journey/JourneyMap";

export interface RoutePoint {
  lat: number;
  lon: number;
}

export interface RouteCandidate {
  route: RoutePoint[];
  risk_score_mean: number;
  risk_score_max: number;
  combined_score: number;
}

export interface SafeRouteResponse {
  route: RoutePoint[];
  risk_score_mean: number;
  risk_score_max: number;
  candidates?: RouteCandidate[];
  error?: string;
}

export interface RouteOption {
  path: LatLng[];
  riskScoreMean: number;
  riskScoreMax: number;
  combinedScore: number;
}

export const ROUTE_LABELS = ["Tercepat", "Teraman", "Alternatif"];

export function routeRiskLabel(score: number) {
  if (score < 3) return { text: "Aman", color: "bg-green-50 text-green-700" };
  if (score < 6) return { text: "Sedang", color: "bg-yellow-50 text-yellow-700" };
  return { text: "Waspada", color: "bg-red-50 text-red-700" };
}

export function formatLocalDatetime(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}