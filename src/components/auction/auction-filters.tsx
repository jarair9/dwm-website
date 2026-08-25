"use client";

import Link from "next/link";

const filters = [
  { label: "Live", value: "live" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Closed", value: "closed" },
];

interface AuctionFiltersProps {
  current: string;
}

export function AuctionFilters({ current }: AuctionFiltersProps) {
  return (
    <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
      {filters.map((f) => (
        <Link
          key={f.value}
          href={`/auctions?status=${f.value}`}
          className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
            current === f.value
              ? "bg-foreground text-background"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
          }`}
        >
          {f.label}
        </Link>
      ))}
    </div>
  );
}
