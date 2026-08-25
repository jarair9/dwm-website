"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/product/product-card";
import { BidCard } from "@/components/auction/bid-card";

interface FavoriteLot {
  id: string;
  slug: string;
  name: string;
  images: string[];
  starting_bid: number;
  current_bid: number | null;
  bid_increment: number;
  end_time: string;
  status: string;
}

export default function FavoritesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [favorites, setFavorites] = useState<FavoriteLot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      if (!profile) {
        setLoading(false);
        return;
      }

      const { data: favs } = await supabase
        .from("favorites")
        .select("lot_id")
        .eq("user_id", profile.id);

      if (!favs || favs.length === 0) {
        setLoading(false);
        return;
      }

      const lotIds = favs.map((f: { lot_id: string }) => f.lot_id);

      const { data: lots } = await supabase
        .from("lots")
        .select("*")
        .in("id", lotIds);

      setFavorites(lots || []);
      setLoading(false);
    };

    getFavorites();
  }, [supabase, router]);

  const liveLots = favorites.filter((l) => l.status === "live" || l.status === "upcoming");
  const productLots = favorites.filter((l) => !["live", "upcoming"].includes(l.status));

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 pt-24 lg:pt-20">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            My Favorites
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Lots and products you&apos;ve saved for later
          </p>

          {loading ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-secondary/30">
                  <div className="aspect-[4/3] rounded-t-2xl bg-secondary/50" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 w-32 rounded bg-secondary" />
                    <div className="h-6 w-24 rounded bg-secondary" />
                  </div>
                </div>
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-border/50 bg-secondary/30 py-16 text-center">
              <svg className="mx-auto h-12 w-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <p className="mt-4 text-lg text-muted-foreground">
                No favorites yet
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Browse auctions and products, then tap the heart icon to save them here.
              </p>
              <Link
                href="/auctions"
                className="mt-6 inline-flex rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                Browse Auctions
              </Link>
            </div>
          ) : (
            <>
              {liveLots.length > 0 && (
                <section className="mt-12">
                  <h2 className="font-serif text-xl font-semibold text-foreground">
                    Auctions
                  </h2>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {liveLots.map((lot) => (
                      <BidCard
                        key={lot.id}
                        auction={{
                          id: lot.id,
                          slug: lot.slug,
                          title: lot.name,
                          image: lot.images?.[0] || "/hero-banner.png",
                          currentBid: lot.current_bid || lot.starting_bid,
                          startingPrice: lot.starting_bid,
                          endTime: lot.end_time,
                          bidIncrement: lot.bid_increment,
                        }}
                      />
                    ))}
                  </div>
                </section>
              )}

              {productLots.length > 0 && (
                <section className="mt-12">
                  <h2 className="font-serif text-xl font-semibold text-foreground">
                    Products
                  </h2>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {productLots.map((lot) => (
                      <ProductCard
                        key={lot.id}
                        product={{
                          id: lot.id,
                          slug: lot.slug,
                          title: lot.name,
                          image: lot.images?.[0] || "/hero-banner.png",
                          price: lot.starting_bid,
                        }}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
