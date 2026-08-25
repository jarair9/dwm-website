export default function AuctionsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="h-8 w-32 animate-pulse rounded bg-secondary" />
        <div className="mt-4 h-12 w-64 animate-pulse rounded bg-secondary" />
        <div className="mt-4 h-5 w-96 animate-pulse rounded bg-secondary" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-border/50">
              <div className="aspect-[4/3] animate-pulse bg-secondary" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 animate-pulse rounded bg-secondary" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-secondary" />
                <div className="h-8 w-1/3 animate-pulse rounded bg-secondary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
