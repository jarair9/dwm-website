import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export async function AuctionLinks() {
  const supabase = await createClient();

  const { data: upcomingLots } = await supabase
    .from("lots")
    .select("id, slug, name, images, starting_bid, start_time")
    .eq("status", "upcoming")
    .eq("type", "lot")
    .order("start_time", { ascending: true })
    .limit(4);

  const { data: closedLots } = await supabase
    .from("lots")
    .select("id, slug, name, images, current_bid, starting_bid, status")
    .in("status", ["closed", "sold", "not_sold"])
    .eq("type", "lot")
    .order("updated_at", { ascending: false })
    .limit(4);

  return (
    <section className="bg-secondary/30 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
        {/* Upcoming Lots */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-red-400" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground whitespace-nowrap">
              Upcoming Lots
            </h2>
            <div className="h-px flex-1 bg-red-400" />
          </div>
          {upcomingLots && upcomingLots.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {upcomingLots.map((lot) => (
                  <Link
                    key={lot.id}
                    href={`/auctions/${lot.slug}`}
                    className="group block"
                  >
                    <div className="overflow-hidden rounded-2xl border border-border/50 bg-white transition-all duration-300 hover:shadow-lg hover:shadow-black/5">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary/30">
                        <Image
                          src={lot.images?.[0] || "/hero-banner.png"}
                          alt={lot.name}
                          fill
                          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="text-xs sm:text-sm font-bold text-foreground leading-snug line-clamp-2">
                          {lot.name}
                        </h3>
                        <div className="mt-2 pt-2 border-t border-border/50">
                          <p className="text-[10px] sm:text-xs text-muted-foreground">Starting at</p>
                          <p className="text-sm sm:text-base font-bold text-foreground">
                            ${lot.starting_bid.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link
                  href="/auctions?status=upcoming"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-secondary"
                >
                  View all
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-border/50 bg-white py-8 text-center">
              <p className="text-sm text-muted-foreground">New lots coming soon</p>
            </div>
          )}
        </div>

        {/* Closed Auctions */}
        {closedLots && closedLots.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-red-400" />
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground whitespace-nowrap">
                Closed Auctions
              </h2>
              <div className="h-px flex-1 bg-red-400" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {closedLots.map((lot) => {
                const isSold = lot.status === "sold";
                const isNotSold = lot.status === "not_sold";
                const salePrice = lot.current_bid || lot.starting_bid;

                return (
                  <Link
                    key={lot.id}
                    href={`/auctions/${lot.slug}`}
                    className="group block"
                  >
                    <div className="overflow-hidden rounded-2xl border border-border/50 bg-white transition-all duration-300 hover:shadow-lg hover:shadow-black/5">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary/30">
                        <Image
                          src={lot.images?.[0] || "/hero-banner.png"}
                          alt={lot.name}
                          fill
                          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="inline-flex rounded-full bg-foreground px-2 py-0.5 text-[10px] font-bold text-white">
                            {isSold ? "SOLD" : isNotSold ? "NOT SOLD" : "ENDED"}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="text-xs sm:text-sm font-bold text-foreground leading-snug line-clamp-2">
                          {lot.name}
                        </h3>
                        <div className="mt-2 pt-2 border-t border-border/50">
                          <p className="text-[10px] sm:text-xs text-muted-foreground">
                            {isSold ? "Sold for" : "Final Bid"}
                          </p>
                          <p className="text-sm sm:text-base font-bold text-foreground">
                            ${salePrice.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/auctions?status=closed"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-secondary"
              >
                View all
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
