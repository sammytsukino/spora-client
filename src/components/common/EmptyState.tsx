interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ 
  title, 
  description, 
  icon,
  action 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 px-6 text-center">
      {icon && (
        <div className="mb-6 text-[var(--spora-primary)] opacity-40">
          {icon}
        </div>
      )}
      <h3 className="font-bizud-mincho-bold text-xl md:text-2xl mb-3 text-[var(--spora-primary)]">
        {title}
      </h3>
      {description && (
        <p className="font-supply-mono text-sm md:text-base text-[var(--spora-primary)] opacity-75 max-w-md mb-6">
          {description}
        </p>
      )}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="px-6 py-2 border-2 border-[var(--spora-primary)] text-[var(--spora-primary)] font-supply-mono text-xs uppercase tracking-[0.3em] hover:bg-[var(--spora-primary)] hover:text-[var(--spora-text-secondary)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--spora-primary)] focus-visible:ring-offset-2"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
