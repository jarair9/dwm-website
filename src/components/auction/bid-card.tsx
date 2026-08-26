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
    status?: string;
  };
  showUrgency?: boolean;
}

export function BidCard({ auction, showUrgency }: BidCardProps) {
  const hasBids = auction.currentBid > auction.startingPrice;
  const timeLeft = Math.max(0, Math.floor((new Date(auction.endTime).getTime() - Date.now()) / 1000));
  const isEndingSoon = timeLeft > 0 && timeLeft < 3600;

  return (
    <Link href={`/auctions/${auction.slug}`} className="group block">
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-white transition-all duration-300 hover:shadow-lg hover:shadow-black/5">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary/30">
          <Image
            src={auction.image}
            alt={auction.title}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Live badge */}
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              LIVE
            </span>
          </div>
          {/* Ending Soon badge */}
          {isEndingSoon && showUrgency && (
            <div className="absolute top-2 right-12">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                ENDING SOON
              </span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <FavoriteButton lotId={auction.id} />
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-bold text-foreground leading-snug line-clamp-2">
            {auction.title}
          </h3>

          {/* Bid info */}
          <div className="mt-2 flex items-center justify-between">
            <div>
              <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {hasBids ? "Current Bid" : "Starting Bid"}
              </p>
              <p className="text-sm sm:text-base font-bold text-foreground">
                ${(hasBids ? auction.currentBid : auction.startingPrice).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Ends in
              </p>
              <CountdownTimer endTime={auction.endTime} />
            </div>
          </div>

          {/* Place Bid button */}
          <div className="mt-3">
            <span className="flex w-full items-center justify-center rounded-xl bg-foreground py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-background transition-all group-hover:bg-foreground/90">
              Place Bid
              <svg className="ml-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
