import type { ProfileMetricsData } from "@/data/profile-data";

interface ProfileMetricsProps {
  metrics: ProfileMetricsData;
}

const metricLabels: Record<keyof ProfileMetricsData, string> = {
  totalViews: "views",
  totalCuttings: "cuttings",
  totalShares: "shares",
};

export default function ProfileMetrics({ metrics }: ProfileMetricsProps) {
  const entries = (
    ["totalViews", "totalCuttings", "totalShares"] as const
  ).map((key) => ({ key, value: metrics[key], label: metricLabels[key] }));

  return (
    <section
      className="border-2 border-black bg-[#E9E9E9] px-6 py-4 flex flex-wrap items-center gap-x-8 gap-y-2"
      aria-label="Overview metrics"
    >
      {entries.map(({ key, value, label }) => (
        <div key={key} className="flex items-baseline gap-2 font-jetbrains-mono">
          <span className="text-lg font-bold">{value.toLocaleString()}</span>
          <span className="text-[11px] uppercase opacity-80">{label}</span>
        </div>
      ))}
    </section>
  );
}
