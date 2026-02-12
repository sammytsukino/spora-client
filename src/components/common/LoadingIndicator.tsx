interface LoadingIndicatorProps {
  current: number;
  total: number;
  message?: string;
}

export default function LoadingIndicator({ 
  current, 
  total, 
  message = "LOADING MORE..." 
}: LoadingIndicatorProps) {
  const progress = total > 0 ? (current / total) * 100 : 0;
  
  return (
    <div className="py-8 md:py-12 text-center">
      <div className="inline-flex flex-col items-center gap-3 font-supply-mono text-xs text-[var(--spora-primary)]">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 border-2 border-[var(--spora-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
          <span className="uppercase tracking-[0.2em]">{message}</span>
        </div>
        <div className="w-32 h-[2px] bg-[var(--spora-primary)]/20 overflow-hidden">
          <div 
            className="h-full bg-[var(--spora-primary)] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] opacity-75">{current} / {total}</span>
      </div>
    </div>
  );
}
