"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CountdownTimer } from "./countdown-timer";
import { toast } from "sonner";

interface BidPanelProps {
  lot: {
    id: string;
    startingBid: number;
    currentBid: number | null;
    bidIncrement: number;
    endTime: string;
    status: string;
  };
}

export function BidPanel({ lot }: BidPanelProps) {
  const currentBid = lot.currentBid || lot.startingBid;
  const minBid = currentBid + lot.bidIncrement;
  const [bidAmount, setBidAmount] = useState(minBid);
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<{
    id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
  } | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Profile form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formWhatsapp, setFormWhatsapp] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        setUser(authUser);

        const { data: prof } = await supabase
          .from("profiles")
          .select("id, full_name, email, phone")
          .eq("auth_id", authUser.id)
          .single();

        if (prof) {
          setProfile(prof);
          setFormName(prof.full_name || "");
          setFormEmail(prof.email || authUser.email || "");
          setFormPhone(prof.phone || "");
        }
      }
      setProfileLoading(false);
    };
    checkUser();
  }, []);

  const isProfileComplete = profile?.full_name && profile?.email && profile?.phone;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    setSavingProfile(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formName.trim(),
        email: formEmail.trim().toLowerCase(),
        phone: formPhone.trim() || null,
        whatsapp: formWhatsapp.trim() || null,
      })
      .eq("id", profile.id);

    if (error) {
      toast.error("Failed to save profile");
    } else {
      setProfile({
        ...profile,
        full_name: formName.trim(),
        email: formEmail.trim().toLowerCase(),
        phone: formPhone.trim(),
      });
      toast.success("Profile saved! You can now place bids.");
    }
    setSavingProfile(false);
  };

  const handlePlaceBid = async () => {
    setIsPlacingBid(true);

    if (!user) {
      toast.error("Please sign in to place a bid");
      setIsPlacingBid(false);
      return;
    }

    if (!isProfileComplete) {
      toast.error("Please complete your profile first");
      setIsPlacingBid(false);
      return;
    }

    try {
      const response = await fetch("/api/place-bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auction_id: lot.id,
          amount: bidAmount,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Bid of $${bidAmount.toLocaleString()} placed!`);
        window.location.reload();
      } else {
        toast.error(result.message || "Bid failed");
      }
    } catch {
      toast.error("Failed to place bid. Please try again.");
    }

    setIsPlacingBid(false);
  };

  const suggestedBids = [
    minBid,
    minBid + lot.bidIncrement,
    minBid + lot.bidIncrement * 4,
  ];

  const endDate = new Date(lot.endTime);
  const endFormatted = endDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const handleTimerEnd = async () => {
    // Timer ended — the lot page will auto-close on next load
    window.location.reload();
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Current Bid */}
      <div className="rounded-2xl border border-border/50 p-6">
        <p className="text-sm text-muted-foreground">
          {lot.currentBid ? "Current Bid" : "Starting Bid"}
        </p>
        <p className="mt-1 font-serif text-4xl font-bold text-foreground">
          ${currentBid.toLocaleString()}
        </p>
        {lot.currentBid && (
          <p className="mt-2 text-sm text-muted-foreground">
            Bid increment: ${lot.bidIncrement.toLocaleString()}
          </p>
        )}
      </div>

      {/* Countdown */}
      <div className="rounded-2xl border border-border/50 p-6">
        <p className="mb-4 text-sm font-medium text-foreground">Time left</p>
        <CountdownTimer
          endTime={lot.endTime}
          variant="detailed"
          onEnd={handleTimerEnd}
        />
        <div className="mt-4 border-t border-border/50 pt-4">
          <p className="text-sm text-muted-foreground">
            Auction ends:{" "}
            <span className="font-medium text-foreground">{endFormatted}</span>
          </p>
        </div>
      </div>

      {/* Place Bid / Profile / Sign In */}
      {lot.status === "live" && (
        <div className="rounded-2xl border border-border/50 p-6">
          {profileLoading ? (
            <div className="space-y-3">
              <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
              <div className="h-10 rounded bg-secondary" />
            </div>
          ) : !user ? (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Sign in to place a bid
              </p>
              <Link href="/login">
                <Button className="mt-4 w-full rounded-full py-6 text-lg">
                  Sign In to Bid
                </Button>
              </Link>
              <p className="mt-3 text-xs text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  Register
                </Link>
              </p>
            </div>
          ) : !isProfileComplete ? (
            <div>
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm font-medium text-amber-800">
                  Complete your profile to bid
                </p>
                <p className="mt-1 text-xs text-amber-700">
                  Please provide your real name, email, and phone number. These
                  details are required to coordinate auction wins, payments, and
                  delivery. Incorrect details may result in cancellation.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div>
                  <Label htmlFor="bid-name" className="text-sm">
                    Full Name *
                  </Label>
                  <Input
                    id="bid-name"
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Your full name"
                    className="mt-1"
                    required
                    maxLength={100}
                  />
                </div>
                <div>
                  <Label htmlFor="bid-email" className="text-sm">
                    Email *
                  </Label>
                  <Input
                    id="bid-email"
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1"
                    required
                    maxLength={255}
                  />
                </div>
                <div>
                  <Label htmlFor="bid-phone" className="text-sm">
                    Phone *
                  </Label>
                  <Input
                    id="bid-phone"
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="mt-1"
                    required
                    maxLength={20}
                  />
                </div>
                <div>
                  <Label htmlFor="bid-whatsapp" className="text-sm">
                    WhatsApp{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="bid-whatsapp"
                    type="tel"
                    value={formWhatsapp}
                    onChange={(e) => setFormWhatsapp(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="mt-1"
                    maxLength={20}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full rounded-full"
                >
                  {savingProfile ? "Saving..." : "Save & Continue to Bidding"}
                </Button>
              </form>
            </div>
          ) : (
            <>
              <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                <p className="text-xs text-blue-700">
                  Bidding as{" "}
                  <span className="font-medium">{profile.full_name}</span> (
                  {profile.email})
                </p>
              </div>

              <Label htmlFor="bid" className="text-sm font-medium">
                Place your bid (min increment $
                {lot.bidIncrement.toLocaleString()})
              </Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="bid"
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  min={minBid}
                  step={lot.bidIncrement}
                  className="pl-7 text-lg font-medium"
                />
              </div>

              <div className="mt-3 flex gap-2">
                {suggestedBids.map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setBidAmount(amount)}
                    className={
                      bidAmount === amount
                        ? "border-foreground bg-foreground text-background"
                        : ""
                    }
                  >
                    ${amount.toLocaleString()}
                  </Button>
                ))}
              </div>

              <Button
                onClick={handlePlaceBid}
                disabled={isPlacingBid}
                className="mt-4 w-full rounded-full py-6 text-lg"
              >
                {isPlacingBid ? "Placing Bid..." : "Place Bid"}
              </Button>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                By placing a bid you agree to our terms. Ensure your contact
                details are correct — we will use them to coordinate if you win.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
