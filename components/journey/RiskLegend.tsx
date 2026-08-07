export default function RiskLegend() {
  return (
    <div className="absolute left-3 top-3 z-[1000] w-44 rounded-xl bg-white p-3 shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">Risk Prediction</span>
        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-slate-300 text-[9px] text-slate-400">
          i
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500" />
      <div className="mt-1 flex justify-between text-[10px] text-slate-500">
        <span>Low</span>
        <span>Moderate</span>
        <span>High</span>
      </div>
    </div>
  );
}