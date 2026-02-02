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
          className={`font-supply-mono text-[11px] px-3 py-1 border-2 border-[#262626] uppercase transition-colors ${
            activeFilter === filter
              ? 'bg-[#262626] text-lime-300'
              : 'bg-transparent text-[#262626] hover:bg-[#262626]/10'
          }`}
          onClick={() => onFilterChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
