"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { NavUser } from "@/components/layout/nav-user";
import type { User, Session } from "@supabase/supabase-js";

const AUCTION_DROPDOWN = [
  { href: "/auctions?status=live", label: "Live Auctions" },
  { href: "/auctions?status=upcoming", label: "Upcoming Auctions" },
  { href: "/auctions?status=closed", label: "Closed Auctions" },
];

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [auctionOpen, setAuctionOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser((data.user as User | null) ?? null);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [supabase]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAuctionOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleDropdownEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setAuctionOpen(true);
  };

  const handleDropdownLeave = () => {
    timeoutRef.current = setTimeout(() => setAuctionOpen(false), 150);
  };

  const navLinks = [
    { href: "/minerals", label: "Minerals" },
    { href: "/gemstones", label: "Gemstones" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-border/30"
            : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center px-4 sm:px-6">
          {/* Left: Mobile hamburger + Logo */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex lg:hidden items-center gap-1.5 mr-3"
          >
            <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5">
            <Image
              src="/logo.png"
              alt="Distinct Mineral World"
              width={48}
              height={48}
              className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-full object-cover"
              priority
            />
            <span className="font-serif text-sm sm:text-lg lg:text-xl font-extrabold tracking-tight text-black leading-tight">
              Distinct Mineral World
            </span>
          </Link>

          {/* Center: Nav links */}
          <nav className="hidden lg:flex items-center gap-8 mx-auto">
            {/* Auctions dropdown */}
            <div
              ref={dropdownRef}
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
              className="relative"
            >
              <Link
                href="/auctions"
                className="flex items-center gap-1 text-sm font-medium text-black/80 transition-colors hover:text-black"
                onClick={() => setAuctionOpen(false)}
              >
                Auctions
                <svg
                  className={`h-3.5 w-3.5 transition-transform ${auctionOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              {auctionOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-border bg-white py-2 shadow-lg">
                  {AUCTION_DROPDOWN.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setAuctionOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm font-medium text-black/80 transition-colors hover:bg-secondary hover:text-black"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-black/80 transition-colors hover:text-black">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Favorites + Account */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 ml-auto shrink-0">
            <Link
              href={user ? "/favorites" : "/login"}
              className="flex items-center text-black/80 transition-colors hover:text-black"
              aria-label="My Favorites"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </Link>
            {user ? (
              <NavUser user={user} />
            ) : (
              <Link href="/login" className="text-xs sm:text-sm font-medium text-black/80 transition-colors hover:text-black whitespace-nowrap">
                My Account
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-72 bg-white shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-border px-6">
              <span className="font-serif text-lg font-bold text-foreground">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-foreground">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col p-4">
              {/* Mobile Auctions section */}
              <div className="px-4 py-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Auctions</p>
                {AUCTION_DROPDOWN.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center rounded-lg px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-3 border-t border-border" />
              <Link
                href={user ? "/favorites" : "/login"}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                My Favorites
              </Link>
              {user ? (
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  My Account
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
