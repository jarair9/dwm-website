import Link from "next/link";
import Image from "next/image";

export function AuctionLinks() {
  return (
    <section className="bg-white py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Upcoming Auctions */}
          <Link href="/auctions?status=upcoming" className="group relative block h-64 overflow-hidden rounded-2xl">
            <Image
              src="/upcoming-auction.jpg"
              alt="Upcoming Auctions"
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </Link>

          {/* Closed Auctions */}
          <Link href="/auctions?status=closed" className="group relative block h-64 overflow-hidden rounded-2xl">
            <Image
              src="/closed-auction.jpg"
              alt="Closed Auctions"
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
