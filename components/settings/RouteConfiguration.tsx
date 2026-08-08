// components/settings/RouteConfiguration.tsx
"use client";

import { useRouteConfigStore } from "@/app/hooks/use-route-config";

export default function RouteConfiguration() {
  const { version, k, nRoutes, penaltyFactor, setVersion, setK, setNRoutes, setPenaltyFactor, reset } =
    useRouteConfigStore();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-1 text-sm font-bold text-[#432F9F]">Konfigurasi Rute</h2>
      <p className="mb-4 text-xs text-slate-400">
        Atur algoritma pencarian rute aman yang digunakan.
      </p>

      <div className="flex flex-col gap-4">
        {/* Version toggle */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600">
            Versi algoritma
          </label>
          <div className="flex gap-2">
            {(["v1", "v2"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVersion(v)}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                  version === v
                    ? "border-[#E62DAC] bg-pink-50 text-[#E62DAC]"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                {v === "v1" ? "V1 · K-Shortest Paths" : "V2 · Diverse Routes"}
              </button>
            ))}
          </div>
        </div>

        {/* v1-only: k */}
        {version === "v1" && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">
              Jumlah kandidat rute (k): {k}
            </label>
            <input
              type="range"
              min={1}
              max={50}
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
              className="w-full accent-[#E62DAC]"
            />
          </div>
        )}

        {/* v2-only: n_routes + penalty_factor */}
        {version === "v2" && (
          <>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Jumlah rute alternatif (n_routes): {nRoutes}
              </label>
              <input
                type="range"
                min={2}
                max={100}
                value={nRoutes}
                onChange={(e) => setNRoutes(Number(e.target.value))}
                className="w-full accent-[#E62DAC]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Faktor penalti keberagaman (penalty_factor): {penaltyFactor.toFixed(1)}
              </label>
              <input
                type="range"
                min={1.0}
                max={5.0}
                step={0.1}
                value={penaltyFactor}
                onChange={(e) => setPenaltyFactor(Number(e.target.value))}
                className="w-full accent-[#E62DAC]"
              />
            </div>
          </>
        )}

        <button
          type="button"
          onClick={reset}
          className="self-start text-xs font-semibold text-slate-400 underline"
        >
          Kembalikan default
        </button>
      </div>
    </section>
  );
}