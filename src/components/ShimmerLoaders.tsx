export function ShimmerCard({ className = "" }: { className?: string }) {
  return (
    <div className={`glass-card p-5 ${className}`}>
      <div className="space-y-3">
        <div className="shimmer-bg h-4 w-1/3 rounded" />
        <div className="shimmer-bg h-8 w-2/3 rounded" />
        <div className="shimmer-bg h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}

export function ShimmerText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="shimmer-bg h-3 rounded"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  );
}

export function ShimmerBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`glass-card p-6 ${className}`}>
      <div className="shimmer-bg h-5 w-1/4 rounded mb-4" />
      <ShimmerText lines={4} />
    </div>
  );
}
