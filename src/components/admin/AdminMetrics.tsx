import { Download } from "lucide-react";
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
  totalFloras: "floras",
  totalBlossoming: "blossoming",
  totalSealed: "sealed",
  totalHidden: "hidden",
  pendingReports: "pending reports",
  flaggedContent: "flagged",
};

export default function AdminMetrics({ metrics, onExportMetrics }: AdminMetricsProps) {
  return (
    <section
      className="border-2 border-[#262626] bg-[#E9E9E9] px-6 py-4 flex flex-wrap items-center justify-between gap-4"
      aria-label="Admin metrics"
    >
      <div className="flex flex-wrap items-center gap-x-8 gap-y-2 font-supply-mono">
        {metricKeys.map((key) => (
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
    </section>
  );
}
