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
    bidCount?: number;
  };
  showUrgency?: boolean;
  compact?: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; pulse?: boolean }> = {
  live: { label: "LIVE", color: "bg-foreground", pulse: true },
  upcoming: { label: "UPCOMING", color: "bg-muted" },
  sold: { label: "SOLD", color: "bg-muted" },
  closed: { label: "ENDED", color: "bg-muted" },
  not_sold: { label: "NOT SOLD", color: "bg-muted" },
  awaiting_payment: { label: "SOLD", color: "bg-muted" },
};

export function BidCard({ auction, showUrgency, compact }: BidCardProps) {
  const hasBids = auction.currentBid > auction.startingPrice;
  const timeLeft = Math.max(0, Math.floor((new Date(auction.endTime).getTime() - Date.now()) / 1000));
  const isEndingSoon = timeLeft > 0 && timeLeft < 3600;
  const isLive = auction.status === "live";
  const isNotSold = auction.status === "not_sold";
  const isClosed = auction.status === "closed" || auction.status === "sold" || auction.status === "awaiting_payment";
  const isUrgent = timeLeft > 0 && timeLeft < 300;

  const statusStyle = STATUS_CONFIG[auction.status || "live"] || STATUS_CONFIG.live;

  if (compact) {
    return (
      <Link href={`/auctions/${auction.slug}`} className="group block">
        <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-white p-2.5 transition-all hover:shadow-md">
          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-secondary/30">
            <Image
              src={auction.image}
              alt={auction.title}
              fill
              className="object-cover"
              sizes="56px"
            />
            <div className="absolute top-0.5 left-0.5">
              <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-bold text-white ${statusStyle.color}`}>
                {statusStyle.pulse && <span className="h-1 w-1 rounded-full bg-white animate-pulse" />}
                {statusStyle.label}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{auction.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-bold text-foreground">
                ${((hasBids ? auction.currentBid : auction.startingPrice)).toLocaleString()}
              </span>
              {isLive && (
                <span className={`font-mono text-[10px] font-medium text-muted-foreground`}>
                  <CountdownTimer endTime={auction.endTime} />
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/auctions/${auction.slug}`} className="group block">
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-white transition-all duration-300 hover:shadow-lg hover:shadow-black/5">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary/30">
          <Image
            src={auction.image}
            alt={auction.title}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Status badge */}
          <div className="absolute top-2 left-2">
            <span className={`inline-flex items-center gap-1 rounded-full ${statusStyle.color} px-2 py-0.5 text-[10px] font-bold text-white shadow-sm`}>
              {statusStyle.pulse && (
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              )}
              {statusStyle.label}
            </span>
          </div>
          {/* Ending Soon badge */}
          {isEndingSoon && showUrgency && isLive && (
            <div className="absolute top-2 right-12">
              <span className="inline-flex items-center gap-1 rounded-full bg-foreground/80 px-2 py-0.5 text-[10px] font-bold text-background">
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
              {isLive ? (
                <>
                  <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Ends in
                  </p>
                  <CountdownTimer endTime={auction.endTime} />
                </>
              ) : isNotSold ? (
                <p className="text-[10px] font-semibold text-amber-600">
                  Contact to Buy
                </p>
              ) : isClosed ? (
                <p className="text-[10px] font-semibold text-muted-foreground">
                  Auction Ended
                </p>
              ) : null}
            </div>
          </div>

          {/* Action button */}
          <div className="mt-3">
            {isLive ? (
              <span className="flex w-full items-center justify-center rounded-xl bg-foreground py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-background transition-all group-hover:bg-foreground/90">
                Place Bid
                <svg className="ml-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            ) : isNotSold ? (
              <span className="flex w-full items-center justify-center rounded-xl border border-foreground/20 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-foreground transition-all group-hover:bg-secondary">
                Contact to Purchase
                <svg className="ml-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </span>
            ) : (
              <span className="flex w-full items-center justify-center rounded-xl border border-border py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-muted-foreground">
                {auction.status === "sold" ? "Sold" : "View Details"}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
