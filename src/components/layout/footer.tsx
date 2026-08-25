import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="Distinct Mineral World"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <span className="font-serif text-xl font-bold tracking-tight">
                Distinct Mineral World
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A curated digital auction house for rare minerals and gemstones.
              Museum-quality specimens from around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-foreground">
              Auctions
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/auctions" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Live Auctions
                </Link>
              </li>
              <li>
                <Link href="/auctions?status=upcoming" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Upcoming
                </Link>
              </li>
              <li>
                <Link href="/auctions?status=ended" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Past Auctions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-foreground">
              Categories
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/minerals" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Minerals
                </Link>
              </li>
              <li>
                <Link href="/gemstones" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Gemstones
                </Link>
              </li>
              <li>
                <Link href="/auctions?status=upcoming" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Upcoming
                </Link>
              </li>
              <li>
                <Link href="/auctions?status=closed" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Past Auctions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-foreground">
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Return &amp; Refund
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Distinct Mineral World. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
