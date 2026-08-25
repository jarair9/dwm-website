"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CTASection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });

    if (error) {
      if (error.code === "23505") {
        toast.info("You're already subscribed!");
        setSubmitted(true);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } else {
      toast.success("You're on the list!");
      setSubmitted(true);
    }

    setEmail("");
    setLoading(false);
  };

  return (
    <section className="bg-foreground py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-4xl font-bold tracking-tight text-white">
            Join the Next Auction
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Be the first to know about upcoming rare specimen auctions. Get
            exclusive access to preview catalogs and early bidding.
          </p>

          {submitted ? (
            <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm">
              <svg
                className="mx-auto h-12 w-12 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-4 text-lg font-medium text-white">
                You&apos;re on the list!
              </p>
              <p className="mt-2 text-sm text-white/70">
                We&apos;ll notify you when the next auction goes live.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-10 flex flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 rounded-full border-white/20 bg-white/10 px-6 py-3.5 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20 min-h-[48px]"
              />
              <Button
                type="submit"
                disabled={loading}
                className="rounded-full bg-white px-8 py-3.5 text-foreground hover:bg-white/90 min-h-[48px]"
              >
                {loading ? "Subscribing..." : "Notify Me"}
              </Button>
            </form>
          )}

          <p className="mt-6 text-xs text-white/50">
            No spam. Unsubscribe anytime. By subscribing you agree to our
            Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  );
}
