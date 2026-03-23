interface FilterTabsProps {
  filters: readonly string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
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

export default function FilterTabs({ filters, activeFilter, onFilterChange }: FilterTabsProps) {
  return (
    <div className="filter-tabs flex max-w-full min-w-0 flex-wrap justify-end gap-2">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          className={`shrink-0 border px-2 py-1 font-supply-mono text-[10px] uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[var(--spora-primary)] focus-visible:ring-offset-2 sm:px-3 sm:text-[11px] ${
            activeFilter === filter
              ? "cursor-default border-[var(--spora-primary)] bg-[var(--spora-primary)] text-[var(--spora-accent-secondary)]"
              : "cursor-pointer border-[var(--spora-primary)] bg-transparent text-[var(--spora-primary)] hover:border-[var(--spora-primary)] hover:bg-[var(--spora-primary)]/10"
          }`}
          onClick={() => onFilterChange(filter)}
        >
          <FilterTabLabel filter={filter} />
        </button>
      ))}
    </div>
  );
}
