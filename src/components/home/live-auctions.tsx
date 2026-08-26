import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BidCard } from "@/components/auction/bid-card";

export async function LiveAuctions() {
  const supabase = await createClient();

  const { data: lots } = await supabase
    .from("lots")
    .select("*")
    .eq("status", "live")
    .order("end_time", { ascending: true })
    .limit(8);

  // Auto-close expired auctions in one batch call (not per-lot)
  await supabase.rpc("close_all_expired_auctions");

  // Re-fetch to get updated statuses
  const { data: refreshedLots } = await supabase
    .from("lots")
    .select("*")
    .eq("status", "live")
    .order("end_time", { ascending: true })
    .limit(8);

  const auctions =
    (refreshedLots || lots || []).map((lot) => ({
      id: lot.id,
      slug: lot.slug,
      title: lot.name,
      image: lot.images?.[0] || "/hero-banner.png",
      currentBid: lot.current_bid || lot.starting_bid,
      startingPrice: lot.starting_bid,
      endTime: lot.end_time,
      bidIncrement: lot.bid_increment,
      status: lot.status,
    })) || [];

  const endingSoon = auctions.filter((a) => {
    const timeLeft = (new Date(a.endTime).getTime() - Date.now()) / 1000;
    return timeLeft > 0 && timeLeft < 3600;
  });

  return (
    <section className="bg-white py-12 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                LIVE NOW
              </span>
              {endingSoon.length > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  {endingSoon.length} ENDING SOON
                </span>
              )}
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Active Auctions
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Bid on museum-quality specimens &mdash; every lot is certified and verified
            </p>
          </div>
          <Link
            href="/auctions"
            className="hidden items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-secondary md:inline-flex"
          >
            View all
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Auction Grid */}
        {auctions.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {auctions.map((auction) => (
              <BidCard key={auction.id} auction={auction} showUrgency />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-border/50 bg-secondary/30 py-16 text-center">
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

        {/* Mobile view all */}
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
