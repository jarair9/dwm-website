"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface Banner {
  id: string;
  image: string;
  title: string | null;
  description: string | null;
  cta_label: string | null;
  cta_url: string | null;
}

export function Hero() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("banners")
      .select("id, image, title, description, cta_label, cta_url")
      .eq("page_type", "home")
      .order("sort_order", { ascending: true })
      .then(({ data }: { data: Banner[] | null }) => {
        const defaultBanner: Banner = {
          id: "default",
          image: "/hero-banner.png",
          title: null,
          description: null,
          cta_label: "Enter Auction",
          cta_url: "/auctions",
        };
        setBanners([defaultBanner, ...(data || [])]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const banner = banners[current];

  if (loading || !banner) {
    return (
      <section className="relative h-[85vh] sm:h-screen w-full overflow-hidden bg-white">
        <Image src="/hero-banner.png" alt="Rare blue sapphire gemstone" fill className="object-cover object-center" priority sizes="100vw" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="h-14 sm:h-16" />
          <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-6">
            <div className="max-w-2xl">
              <p className="mb-2 sm:mb-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-black/70">Curated Auction House</p>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-[1.1] tracking-tight text-black md:text-6xl lg:text-7xl">
                Rare Minerals.<br /><span className="text-black/70">Exceptional Craft.</span>
              </h1>
              <p className="mt-4 sm:mt-6 max-w-md text-sm sm:text-lg leading-relaxed text-black/70">Museum-quality gemstones and minerals, presented with the reverence they deserve.</p>
              <div className="mt-6 sm:mt-10 flex items-center gap-3 sm:gap-4">
                <Link href="/auctions" className="rounded-full bg-black px-5 sm:px-8 py-2.5 sm:py-3.5 text-xs sm:text-sm font-medium text-white transition-all hover:bg-black/80 hover:shadow-lg">Enter Auction</Link>
                <Link href="/minerals" className="rounded-full border border-black/20 px-5 sm:px-8 py-2.5 sm:py-3.5 text-xs sm:text-sm font-medium text-black transition-all hover:bg-black/5">View Collection</Link>
              </div>
            </div>
          </div>
          <Stats />
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[85vh] sm:h-screen w-full overflow-hidden bg-white">
      {banners.map((b, i) => (
        b.image ? (
          <div key={b.id} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? "auto" : "none" }}>
            <Image src={b.image} alt={b.title || "Banner"} fill className="object-cover object-center" priority={i === 0} sizes="100vw" />
          </div>
        ) : null
      ))}

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="h-14 sm:h-16" />
        <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-6">
          <div className="max-w-2xl">
            {banner.title && (
              <p className="mb-2 sm:mb-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-black/70">{banner.title}</p>
            )}
            <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-[1.1] tracking-tight text-black md:text-6xl lg:text-7xl">
              Rare Minerals.<br /><span className="text-black/70">Exceptional Craft.</span>
            </h1>
            {banner.description && (
              <p className="mt-4 sm:mt-6 max-w-md text-sm sm:text-lg leading-relaxed text-black/70">{banner.description}</p>
            )}
            <div className="mt-6 sm:mt-10 flex items-center gap-3 sm:gap-4">
              <Link href={banner.cta_url || "/auctions"} className="rounded-full bg-black px-5 sm:px-8 py-2.5 sm:py-3.5 text-xs sm:text-sm font-medium text-white transition-all hover:bg-black/80 hover:shadow-lg">
                {banner.cta_label || "Enter Auction"}
              </Link>
              <Link href="/minerals" className="rounded-full border border-black/20 px-5 sm:px-8 py-2.5 sm:py-3.5 text-xs sm:text-sm font-medium text-black transition-all hover:bg-black/5">
                View Collection
              </Link>
            </div>
          </div>
        </div>

        {banners.length > 1 && (
          <div className="absolute bottom-28 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {banners.map((b, i) => (
              <button key={b.id} onClick={() => setCurrent(i)} className={`h-2 rounded-full transition-all ${i === current ? "w-8 bg-black" : "w-2 bg-black/30"}`} />
            ))}
          </div>
        )}

        <Stats />
      </div>
    </section>
  );
}

function Stats() {
  return (
    <div className="border-t border-black/10 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 sm:gap-12 px-6 py-4 sm:py-6">
        {[
          { value: "200+", label: "Specimens Sold" },
          { value: "50+", label: "Countries" },
          { value: "$2M+", label: "Total Volume" },
        ].map((stat, i) => (
          <div key={i} className="flex items-center gap-6 sm:gap-12">
            <div className="text-center">
              <p className="font-serif text-lg sm:text-2xl font-bold text-black">{stat.value}</p>
              <p className="mt-1 text-[10px] sm:text-xs text-black/60">{stat.label}</p>
            </div>
            {i < 2 && <div className="h-6 sm:h-8 w-px bg-black/10" />}
          </div>
        ))}
      </div>
    </div>
  );
}
