import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { CountdownTimer } from "@/components/auction/countdown-timer";

export async function LiveAuctions() {
  const supabase = await createClient();

  const { data: lots } = await supabase
    .from("lots")
    .select("id, slug, name, images, current_bid, starting_bid, end_time, bid_increment, status")
    .eq("status", "live")
    .eq("type", "lot")
    .order("end_time", { ascending: true })
    .limit(8);

  await supabase.rpc("close_all_expired_auctions");

  const { data: refreshedLots } = await supabase
    .from("lots")
    .select("id, slug, name, images, current_bid, starting_bid, end_time, bid_increment, status")
    .eq("status", "live")
    .eq("type", "lot")
    .order("end_time", { ascending: true })
    .limit(8);

  const auctions = (refreshedLots || lots || []).map((lot) => ({
    id: lot.id,
    slug: lot.slug,
    name: lot.name,
    image: lot.images?.[0] || "/hero-banner.png",
    current_bid: lot.current_bid || 0,
    starting_bid: lot.starting_bid,
    end_time: lot.end_time,
    has_bids: lot.current_bid > 0 && lot.current_bid > lot.starting_bid,
  }));

  return (
    <section className="bg-white pt-2 pb-12 sm:pt-4 sm:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading with lines */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-red-400" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground whitespace-nowrap">
            LIVE AUCTIONS
          </h2>
          <div className="h-px flex-1 bg-red-400" />
        </div>

        {auctions.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {auctions.map((auction) => (
                <Link
                  key={auction.id}
                  href={`/auctions/${auction.slug}`}
                  className="group block"
                >
                  <div className="overflow-hidden rounded-2xl border border-border/50 bg-white transition-all duration-300 hover:shadow-lg hover:shadow-black/5">
                    <div className="relative aspect-[4/3] overflow-hidden bg-secondary/30">
                      <Image
                        src={auction.image}
                        alt={auction.name}
                        fill
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="text-xs sm:text-sm font-bold text-foreground leading-snug line-clamp-2">
                        {auction.name}
                      </h3>
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            {auction.has_bids ? "Current Bid" : "Starting Bid"}
                          </p>
                          <p className="text-sm sm:text-base font-bold text-foreground">
                            ${(auction.has_bids ? auction.current_bid : auction.starting_bid).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            Ends in
                          </p>
                          <CountdownTimer endTime={auction.end_time} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/auctions"
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
          <div className="rounded-2xl border border-border/50 bg-secondary/30 py-16 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              No live auctions at the moment
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              New lots are added weekly &mdash; subscribe to get notified
            </p>
            <Link
              href="/auctions?status=upcoming"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-all hover:bg-foreground/90"
            >
              View Upcoming Lots
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
