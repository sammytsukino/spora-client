interface ErrorStateProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ 
  title, 
  message,
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 px-6 text-center">
      <div className="mb-6 text-red-500 opacity-60">
        <svg 
          className="w-12 h-12" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
      </div>
      <h3 className="font-bizud-mincho-bold text-xl md:text-2xl mb-3 text-[var(--spora-primary)]">
        {title}
      </h3>
      <p className="font-supply-mono text-sm md:text-base text-[var(--spora-primary)] opacity-75 max-w-md mb-6">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-6 py-2 border-2 border-[var(--spora-primary)] text-[var(--spora-primary)] font-supply-mono text-xs uppercase tracking-[0.3em] hover:bg-[var(--spora-primary)] hover:text-[var(--spora-text-secondary)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--spora-primary)] focus-visible:ring-offset-2"
        >
          TRY AGAIN
        </button>
      )}
    </div>
  );
}
