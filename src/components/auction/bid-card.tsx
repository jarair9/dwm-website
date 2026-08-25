"use client";

import Link from "next/link";
import Image from "next/image";
import { CountdownTimer } from "./countdown-timer";
import { FavoriteButton } from "@/components/product/favorite-button";

interface BidCardProps {
  auction: {
    id: string;
    slug: string;
    title: string;
    image: string;
    currentBid: number;
    startingPrice: number;
    endTime: string;
    bidIncrement: number;
  };
}

export function BidCard({ auction }: BidCardProps) {
  const hasBids = auction.currentBid > auction.startingPrice;

  return (
    <Link href={`/auctions/${auction.slug}`} className="group block">
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-white transition-all duration-300 hover:shadow-lg hover:shadow-black/5">
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary/30">
          <Image
            src={auction.image}
            alt={auction.title}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute top-2 right-2">
            <FavoriteButton lotId={auction.id} />
          </div>
        </div>
        <div className="p-2 sm:p-4 text-center">
          <h3 className="text-[11px] sm:text-sm font-bold text-foreground leading-snug line-clamp-2">
            {auction.title}
          </h3>
          <div className="mt-1 sm:mt-2">
            <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {hasBids ? "Current Bid" : "Starting Bid"}
            </p>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-base font-bold text-foreground">
              ${(hasBids ? auction.currentBid : auction.startingPrice).toLocaleString()}
            </p>
          </div>
          <div className="mt-1 sm:mt-2 border-t border-border/50 pt-1 sm:pt-2">
            <p className="text-[9px] sm:text-[10px] text-muted-foreground">Auction ends:</p>
            <div className="flex justify-center">
              <CountdownTimer endTime={auction.endTime} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
