"use client";

import {
  CrowdReport,
} from "./types";

import {
  LEVEL_COLOR,
  LEVEL_LABEL,
} from "./crowdData";

interface RecentReportsProps {
  reports: CrowdReport[];
}

export default function RecentReports({
  reports,
}: RecentReportsProps) {
  if (reports.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 bg-white/70 rounded-2xl p-4">
      <h3 className="text-[#7A1155] font-semibold text-sm mb-2">
        Laporan Terbaru
      </h3>

      <ul className="flex flex-col gap-2">
        {reports.map((report) => (
          <li
            key={report.id}
            className="flex items-center justify-between text-xs bg-[#FCE4F1] rounded-lg px-3 py-2"
          >
            <span className="text-gray-700">
              {report.location}
            </span>

            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    LEVEL_COLOR[report.level],
                }}
              />

              <span className="font-medium text-[#7A1155]">
                {LEVEL_LABEL[report.level]}
              </span>

              <span className="text-gray-400">
                · {report.timestamp}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}