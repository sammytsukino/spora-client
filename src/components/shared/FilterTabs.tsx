interface FilterTabsProps {
  filters: readonly string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function FilterTabs({ filters, activeFilter, onFilterChange }: FilterTabsProps) {
  return (
    <div className="filter-tabs flex gap-2">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`font-supply-mono text-[11px] px-3 py-1 border uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[var(--spora-primary)] focus-visible:ring-offset-2 ${
            activeFilter === filter
              ? 'border-[var(--spora-primary)] bg-[var(--spora-primary)] text-[var(--spora-accent-secondary)] cursor-default'
              : 'border-[var(--spora-primary)] bg-transparent text-[var(--spora-primary)] hover:bg-[var(--spora-primary)]/10 hover:border-[var(--spora-primary)] cursor-pointer'
          }`}
          onClick={() => onFilterChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
