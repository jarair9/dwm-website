import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { BidCard } from "@/components/auction/bid-card";

export async function LiveAuctions() {
  const supabase = await createClient();

  const { data: lots } = await supabase
    .from("lots")
    .select("*")
    .eq("status", "live")
    .order("end_time", { ascending: true })
    .limit(5);

  // Auto-close any expired live auctions
  if (lots) {
    const now = new Date();
    for (const lot of lots) {
      if (new Date(lot.end_time) <= now) {
        await supabase.rpc("close_auction", { p_lot_id: lot.id });
        lot.status = "closed";
      }
    }
  }

  const auctions =
    lots?.map((lot) => ({
      id: lot.id,
      slug: lot.slug,
      title: lot.name,
      image: lot.images?.[0] || "/hero-banner.png",
      currentBid: lot.current_bid || lot.starting_bid,
      startingPrice: lot.starting_bid,
      endTime: lot.end_time,
      bidIncrement: lot.bid_increment,
    })) || [];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="outline" className="mb-4 px-3 py-1 text-xs">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Live Now
            </Badge>
            <h2 className="font-serif text-4xl font-bold tracking-tight text-foreground">
              Active Auctions
            </h2>
          </div>
          <Link
            href="/auctions"
            className="hidden items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-secondary md:inline-flex"
          >
            View all auctions
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {auctions.length > 0 ? (
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {auctions.map((auction) => (
              <BidCard key={auction.id} auction={auction} />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-border/50 bg-secondary/30 py-10 text-center">
            <p className="text-lg text-muted-foreground">
              No live auctions at the moment
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Check back soon for new listings
            </p>
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/auctions"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-secondary"
          >
            View all auctions
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
