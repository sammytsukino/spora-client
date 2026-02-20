import { Download, TrendingUp, TrendingDown } from "lucide-react";
import type { AdminMetricsData } from "@/data/admin-data";

interface AdminMetricsProps {
  metrics: AdminMetricsData;
  onExportMetrics?: () => void;
}

const metricKeys: (keyof AdminMetricsData)[] = [
  "totalUsers",
  "totalFloras",
  "totalBlossoming",
  "totalSealed",
  "totalHidden",
  "pendingReports",
  "flaggedContent",
];

const metricLabels: Record<keyof AdminMetricsData, string> = {
  totalUsers: "users",
  totalFloras: "Floras",
  totalBlossoming: "Blossoming",
  totalSealed: "Sealed",
  totalHidden: "Hidden",
  pendingReports: "pending reports",
  flaggedContent: "flagged",
};

export default function AdminMetrics({ metrics, onExportMetrics }: AdminMetricsProps) {
  const growth = metrics.growth;
  return (
    <section
      className="border-2 border-[#262626] bg-[#E9E9E9] px-6 py-4"
      aria-label="Admin metrics"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 font-supply-mono">
          {metricKeys.filter((k) => typeof metrics[k] === "number").map((key) => (
              <div key={key} className="flex items-baseline gap-2">
                <span className="text-lg font-bold">
                  {metrics[key].toLocaleString()}
                </span>
                <span className="text-[11px] uppercase opacity-80">
                  {metricLabels[key]}
                </span>
              </div>
          ))}
        </div>
        {onExportMetrics && (
          <button
            type="button"
            onClick={onExportMetrics}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#262626] hover:bg-[#262626] hover:text-lime-300 font-supply-mono text-[10px] uppercase shrink-0"
          >
            <Download className="size-3.5" aria-hidden />
            Export metrics
          </button>
        )}
      </div>
      {growth && (
        <div className="flex flex-wrap gap-6 pt-3 border-t-2 border-[#262626]/30 font-supply-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span className="uppercase opacity-80">Users (7d):</span>
            <span className="font-bold">{growth.usersLast7Days}</span>
            <span className="opacity-70">vs {growth.usersPrev7Days} prev</span>
            {growth.usersGrowth !== 0 && (
              <span className={growth.usersGrowth > 0 ? "text-lime-600" : "text-red-600"}>
                {growth.usersGrowth > 0 ? <TrendingUp className="inline size-3.5" /> : <TrendingDown className="inline size-3.5" />}
                {Math.abs(growth.usersGrowth)}%
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="uppercase opacity-80">Floras (7d):</span>
            <span className="font-bold">{growth.florasLast7Days}</span>
            <span className="opacity-70">vs {growth.florasPrev7Days} prev</span>
            {growth.florasGrowth !== 0 && (
              <span className={growth.florasGrowth > 0 ? "text-lime-600" : "text-red-600"}>
                {growth.florasGrowth > 0 ? <TrendingUp className="inline size-3.5" /> : <TrendingDown className="inline size-3.5" />}
                {Math.abs(growth.florasGrowth)}%
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
