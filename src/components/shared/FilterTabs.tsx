import { cn } from "@/lib/utils";

interface FilterTabsProps {
  filters: readonly string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  className?: string;
}

function FilterTabLabel({ filter }: { filter: string }) {
  const gen = filter.match(/^GEN_(\d+)$/);
  if (gen) {
    return (
      <>
        <span className="md:hidden">{`G${gen[1]}`}</span>
        <span className="hidden md:inline">{filter}</span>
      </>
    );
  }
  if (filter === "All Units") {
    return (
      <>
        <span className="md:hidden">All</span>
        <span className="hidden md:inline">{filter}</span>
      </>
    );
  }
  if (filter === "SHOW ALL") {
    return (
      <>
        <span className="md:hidden">All</span>
        <span className="hidden md:inline">{filter}</span>
      </>
    );
  }
  return <>{filter}</>;
}

export default function FilterTabs({
  filters,
  activeFilter,
  onFilterChange,
  className,
}: FilterTabsProps) {
  return (
    <div
      className={cn(
        "filter-tabs flex max-w-full min-w-0 flex-wrap justify-end gap-2",
        className
      )}
    >
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          className={`shrink-0 border px-2 py-1 font-supply-mono text-[10px] uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-spora-primary focus-visible:ring-offset-2 sm:px-3 sm:text-[11px] ${
            activeFilter === filter
              ? "cursor-default border-spora-primary bg-spora-primary text-spora-accent-secondary"
              : "cursor-pointer border-spora-primary bg-transparent text-spora-primary hover:border-spora-primary hover:bg-spora-primary/10"
          }`}
          onClick={() => onFilterChange(filter)}
        >
          <FilterTabLabel filter={filter} />
        </button>
      ))}
    </div>
  );
}
