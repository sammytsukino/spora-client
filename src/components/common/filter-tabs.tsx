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
          className={`font-jetbrains-mono text-[11px] px-3 py-1 border-2 border-black uppercase transition-colors ${
            activeFilter === filter
              ? 'bg-black text-lime-300'
              : 'bg-transparent text-black hover:bg-black/10'
          }`}
          onClick={() => onFilterChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
