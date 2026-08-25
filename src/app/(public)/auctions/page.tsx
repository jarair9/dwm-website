import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { BidCard } from "@/components/auction/bid-card";

export const metadata: Metadata = {
  title: "Auctions | Distinct Mineral World",
  description:
    "Browse gemstone and mineral auctions. Place your bid on museum-quality specimens.",
};

export default async function AuctionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status || "live";

  const supabase = await createClient();

  const query = supabase.from("lots").select("*");

  if (statusFilter === "closed") {
    query.in("status", ["closed", "sold", "not_sold"]);
  } else if (statusFilter === "upcoming") {
    query.eq("status", "upcoming");
  } else {
    query.eq("status", "live");
  }

  const { data: lots } = await query.order("end_time", { ascending: true });

  // Auto-close any expired live auctions
  if (statusFilter === "live" && lots) {
    const expiredLots = lots.filter(
      (lot) => lot.status === "live" && new Date(lot.end_time) <= new Date()
    );
    for (const lot of expiredLots) {
      await supabase.rpc("close_auction", { p_lot_id: lot.id });
      lot.status = "closed";
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
      status: lot.status,
    })) || [];

  const title =
    statusFilter === "upcoming"
      ? "Upcoming Auctions"
      : statusFilter === "closed"
        ? "Closed Auctions"
        : "Live Auctions";

  const description =
    statusFilter === "upcoming"
      ? "Sneak peek at lots coming soon"
      : statusFilter === "closed"
        ? "Past auction results and sold lots"
        : "Browse and bid on exceptional gemstones and minerals";

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-background py-16 pt-24 lg:pt-20">
          <div className="mx-auto max-w-7xl px-6">
            <div>
              <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground">
                {title}
              </h1>
              <p className="mt-3 text-muted-foreground">{description}</p>
            </div>

            {auctions.length > 0 ? (
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {auctions.map((auction) => (
                  <BidCard key={auction.id} auction={auction} />
                ))}
              </div>
            ) : (
              <div className="mt-12 rounded-2xl border border-border/50 bg-secondary/30 py-16 text-center">
                <p className="text-lg text-muted-foreground">
                  No {statusFilter} auctions available at the moment
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Subscribe to get notified when new lots are added
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
