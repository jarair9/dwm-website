export default function AuctionDetailLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="h-4 w-48 animate-pulse rounded bg-secondary" />
        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-secondary" />
          <div className="space-y-6">
            <div className="h-6 w-24 animate-pulse rounded bg-secondary" />
            <div className="h-12 w-3/4 animate-pulse rounded bg-secondary" />
            <div className="h-5 w-full animate-pulse rounded bg-secondary" />
            <div className="h-5 w-2/3 animate-pulse rounded bg-secondary" />
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-secondary" />
              ))}
            </div>
            <div className="h-48 animate-pulse rounded-2xl border border-border/50 bg-secondary/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
