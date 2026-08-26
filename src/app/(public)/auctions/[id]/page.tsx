import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BackButton } from "@/components/layout/back-button";
import { Badge } from "@/components/ui/badge";
import { BidPanel } from "@/components/auction/bid-panel";
import { BidHistory } from "@/components/auction/bid-history";
import { ImageGallery } from "@/components/auction/image-gallery";
import { ContactModal } from "@/components/product/contact-modal";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AuctionDetailPage({ params }: Props) {
  const { id: slug } = await params;
  const supabase = await createClient();

  const { data: lot } = await supabase
    .from("lots")
    .select("*, categories(name, slug)")
    .eq("slug", slug)
    .single();

  if (!lot) notFound();

  // Auto-close expired auctions in batch (not per-lot)
  if (lot.status === "live" && new Date(lot.end_time) <= new Date()) {
    await supabase.rpc("close_all_expired_auctions");
    // Re-fetch to get updated status
    const { data: refreshed } = await supabase
      .from("lots")
      .select("*, categories(name, slug)")
      .eq("slug", slug)
      .single();
    if (refreshed) Object.assign(lot, refreshed);
  }

  const category = lot.categories as { name: string; slug: string } | null;

  return (
    <>
      <Navbar />
      <BackButton />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 pt-24 lg:pt-20">
          <nav className="mb-8 text-sm text-muted-foreground">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span>Auctions</span>
            <span className="mx-2">/</span>
            <span className="text-foreground">{lot.name}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left — Images */}
            <div>
              <ImageGallery
                images={lot.images || []}
                name={lot.name}
                status={lot.status}
              />

              {/* Description below image */}
              {lot.description && (
                <div className="mt-8">
                  <h2 className="font-serif text-xl font-semibold text-foreground">
                    Description
                  </h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed whitespace-pre-line">
                    {lot.description}
                  </p>
                </div>
              )}
            </div>

            {/* Right — Bid info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                {category && <Badge variant="outline">{category.name}</Badge>}
                <Badge
                  variant={lot.status === "live" ? "default" : "outline"}
                  className="capitalize"
                >
                  {lot.status === "live" && (
                    <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                  )}
                  {lot.status}
                </Badge>
              </div>

              <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground">
                {lot.name}
              </h1>

              {lot.status === "live" || lot.status === "upcoming" ? (
                <BidPanel
                  lot={{
                    id: lot.id,
                    startingBid: lot.starting_bid,
                    currentBid: lot.current_bid,
                    bidIncrement: lot.bid_increment,
                    endTime: lot.end_time,
                    status: lot.status,
                  }}
                />
              ) : lot.status === "not_sold" || lot.status === "closed" ? (
                <div className="mt-8 space-y-4">
                  <div className="rounded-2xl border border-border/50 p-6 text-center">
                    <p className="text-lg font-medium text-muted-foreground">
                      Auction {lot.status === "not_sold" ? "ended without a winner" : "has ended"}
                    </p>
                    {lot.current_bid ? (
                      <p className="mt-2 font-serif text-2xl font-bold text-foreground">
                        Final Price: ${lot.current_bid.toLocaleString()}
                      </p>
                    ) : (
                      <p className="mt-2 text-muted-foreground">
                        Starting at ${lot.starting_bid.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <ContactModal
                    productName={lot.name}
                    productPrice={lot.current_bid || lot.starting_bid}
                  />
                </div>
              ) : lot.status === "sold" ? (
                <div className="mt-8 rounded-2xl border border-border/50 p-6 text-center">
                  <p className="text-lg font-medium text-emerald-600">
                    This lot has been sold
                  </p>
                  {lot.current_bid && (
                    <p className="mt-2 font-serif text-2xl font-bold text-foreground">
                      Sold for ${lot.current_bid.toLocaleString()}
                    </p>
                  )}
                </div>
              ) : lot.status === "awaiting_payment" ? (
                <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
                  <p className="text-lg font-medium text-amber-700">
                    Awaiting Payment
                  </p>
                  {lot.current_bid && (
                    <p className="mt-2 font-serif text-2xl font-bold text-foreground">
                      ${lot.current_bid.toLocaleString()}
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-8 rounded-2xl border border-border/50 p-6 text-center">
                  <p className="text-lg font-medium text-muted-foreground capitalize">
                    Auction {lot.status}
                  </p>
                </div>
              )}

              {(lot.status === "live" || lot.status === "closed" || lot.status === "sold" || lot.status === "not_sold" || lot.status === "awaiting_payment") && (
                <BidHistory lotId={lot.id} />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
