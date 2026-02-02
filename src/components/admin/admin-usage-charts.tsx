import type { AdminUsageDataPoint } from "@/data/admin-data";

interface AdminUsageChartsProps {
  florasByDay?: AdminUsageDataPoint[];
  newUsersByWeek?: AdminUsageDataPoint[];
  title?: string;
}

function BarChart({
  data,
  maxHeight = 120,
  ariaLabel,
}: {
  data: AdminUsageDataPoint[];
  maxHeight?: number;
  ariaLabel: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div
      className="flex items-end gap-1 h-[140px]"
      role="img"
      aria-label={ariaLabel}
    >
      {data.map(({ label, value }) => (
        <div
          key={label}
          className="flex-1 flex flex-col items-center gap-1 min-w-0"
        >
          <div
            className="w-full border-2 border-black bg-lime-300 min-h-[8px] transition-all"
            style={{ height: `${(value / max) * maxHeight}px` }}
          />
          <span className="font-jetbrains-mono text-[10px] uppercase truncate w-full text-center">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AdminUsageCharts({
  florasByDay = [],
  newUsersByWeek = [],
  title = "Usage",
}: AdminUsageChartsProps) {
  const hasFloras = florasByDay.length > 0;
  const hasUsers = newUsersByWeek.length > 0;

  if (!hasFloras && !hasUsers) return null;

  return (
    <section className="border-2 border-black bg-[#E9E9E9] p-6">
      <h2 className="font-jetbrains-mono font-bold text-sm uppercase mb-4">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {hasFloras && (
          <div>
            <p className="font-jetbrains-mono text-[11px] uppercase opacity-80 mb-3">
              Floras created (last 7 days)
            </p>
            <BarChart
              data={florasByDay}
              ariaLabel={`Floras per day: ${florasByDay.map((d) => `${d.label} ${d.value}`).join(", ")}`}
            />
          </div>
        )}
        {hasUsers && (
          <div>
            <p className="font-jetbrains-mono text-[11px] uppercase opacity-80 mb-3">
              New users (last 4 weeks)
            </p>
            <BarChart
              data={newUsersByWeek}
              maxHeight={100}
              ariaLabel={`New users per week: ${newUsersByWeek.map((d) => `${d.label} ${d.value}`).join(", ")}`}
            />
          </div>
        )}
      </div>
    </section>
  );
}
