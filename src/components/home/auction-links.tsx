import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export async function AuctionLinks() {
  const supabase = await createClient();

  const { data: upcomingLots } = await supabase
    .from("lots")
    .select("id, slug, name, images, starting_bid, end_time")
    .eq("status", "upcoming")
    .order("start_time", { ascending: true })
    .limit(3);

  const { data: closedLots } = await supabase
    .from("lots")
    .select("id, slug, name, images, current_bid, starting_bid")
    .in("status", ["closed", "sold"])
    .order("updated_at", { ascending: false })
    .limit(3);

  return (
    <section className="bg-secondary/30 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Upcoming Auctions */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  COMING SOON
                </span>
                <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Upcoming Lots
                </h2>
              </div>
              <Link
                href="/auctions?status=upcoming"
                className="text-sm font-medium text-foreground hover:underline"
              >
                View all
              </Link>
            </div>
            {upcomingLots && upcomingLots.length > 0 ? (
              <div className="space-y-3">
                {upcomingLots.map((lot) => (
                  <Link
                    key={lot.id}
                    href={`/auctions/${lot.slug}`}
                    className="group flex items-center gap-4 rounded-xl border border-border/50 bg-white p-3 transition-all hover:shadow-md"
                  >
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-secondary/30">
                      <Image
                        src={lot.images?.[0] || "/hero-banner.png"}
                        alt={lot.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{lot.name}</p>
                      <p className="text-xs text-muted-foreground">Starting at ${lot.starting_bid.toLocaleString()}</p>
                    </div>
                    <svg className="h-4 w-4 flex-shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border/50 bg-white py-8 text-center">
                <p className="text-sm text-muted-foreground">New lots coming soon</p>
              </div>
            )}
          </div>

          {/* Closed Auctions */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  SOLD
                </span>
                <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Recent Results
                </h2>
              </div>
              <Link
                href="/auctions?status=closed"
                className="text-sm font-medium text-foreground hover:underline"
              >
                View all
              </Link>
            </div>
            {closedLots && closedLots.length > 0 ? (
              <div className="space-y-3">
                {closedLots.map((lot) => (
                  <Link
                    key={lot.id}
                    href={`/auctions/${lot.slug}`}
                    className="group flex items-center gap-4 rounded-xl border border-border/50 bg-white p-3 transition-all hover:shadow-md"
                  >
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-secondary/30">
                      <Image
                        src={lot.images?.[0] || "/hero-banner.png"}
                        alt={lot.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{lot.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Sold for ${(lot.current_bid || lot.starting_bid).toLocaleString()}
                      </p>
                    </div>
                    <svg className="h-4 w-4 flex-shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border/50 bg-white py-8 text-center">
                <p className="text-sm text-muted-foreground">No closed auctions yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
