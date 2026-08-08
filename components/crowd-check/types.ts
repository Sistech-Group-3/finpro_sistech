export type CrowdLevel = "Low" | "Moderate" | "High";

export interface CrowdReport {
  id: string;
  location: string;
  level: CrowdLevel;
  timestamp: string;
}