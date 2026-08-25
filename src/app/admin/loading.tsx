export default function AdminLoading() {
  return (
    <div>
      <div className="h-8 w-48 animate-pulse rounded bg-secondary" />
      <div className="mt-2 h-5 w-64 animate-pulse rounded bg-secondary" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl border border-border/50 bg-white" />
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-xl border border-border/50 bg-white" />
        ))}
      </div>
    </div>
  );
}
