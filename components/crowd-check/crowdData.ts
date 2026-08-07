import type { CrowdLevel } from "./types";

export interface CrowdArea {
  id: string;
  latitude: number;
  longitude: number;
  radius: number;
  level: CrowdLevel;
  updatedAt?: string;
}

export const CROWD_DATA: CrowdArea[] = [
  {
    id: "area-1",
    latitude: -6.9175,
    longitude: 107.6191,
    radius: 500,
    level: "High",
    updatedAt: "17:30 WIB",
  },
  {
    id: "area-2",
    latitude: -6.9147,
    longitude: 107.6098,
    radius: 400,
    level: "Moderate",
    updatedAt: "17:25 WIB",
  },
  {
    id: "area-3",
    latitude: -6.9214,
    longitude: 107.6069,
    radius: 300,
    level: "Low",
    updatedAt: "17:20 WIB",
  },
];

export const LEVEL_COLOR: Record<CrowdLevel, string> = {
  Low: "#4ADE80",
  Moderate: "#FBBF24",
  High: "#F43F5E",
};

export const LEVEL_LABEL: Record<CrowdLevel, string> = {
  Low: "Sepi",
  Moderate: "Sedang",
  High: "Ramai",
};