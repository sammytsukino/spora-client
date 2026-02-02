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
  return (
    <div className="py-8 text-center">
      <div className="inline-flex items-center gap-2 font-supply-mono text-xs text-gray-500">
        <div className="w-2 h-2 bg-lime-300 rounded-full animate-pulse" />
        {message} ({current} / {total})
      </div>
    </div>
  );
}
