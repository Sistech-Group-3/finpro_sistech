
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RouteVersion = "v1" | "v2";

interface RouteConfigState {
  version: RouteVersion;
  k: number; // v1: number of k-shortest-path candidates
  nRoutes: number; // v2: number of diverse candidate routes
  penaltyFactor: number; // v2: diversity penalty factor

  setVersion: (version: RouteVersion) => void;
  setK: (k: number) => void;
  setNRoutes: (n: number) => void;
  setPenaltyFactor: (p: number) => void;
  reset: () => void;
}

const DEFAULTS = {
  version: "v1" as RouteVersion,
  k: 3,
  nRoutes: 20,
  penaltyFactor: 1.7,
};

export const useRouteConfigStore = create<RouteConfigState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setVersion: (version) => set({ version }),
      setK: (k) => set({ k: Math.min(50, Math.max(1, k)) }),
      setNRoutes: (nRoutes) => set({ nRoutes: Math.min(100, Math.max(2, nRoutes)) }),
      setPenaltyFactor: (penaltyFactor) =>
        set({ penaltyFactor: Math.max(1.0, penaltyFactor) }),
      reset: () => set(DEFAULTS),
    }),
    { name: "route-config-storage" }
  )
);