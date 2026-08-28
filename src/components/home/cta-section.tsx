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
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-red-400" />
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground whitespace-nowrap">
            Join the Next Auction
          </h2>
          <div className="h-px flex-1 bg-red-400" />
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground">
            Be the first to know about upcoming rare specimen auctions. Get
            exclusive access to preview catalogs and early bidding.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-2xl border border-border/50 bg-secondary/30 p-8">
              <p className="text-lg font-medium text-foreground">
                You&apos;re on the list!
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                We&apos;ll notify you when the next auction goes live.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 rounded-full border-border bg-secondary/30 px-6 py-3.5 text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:ring-foreground/20 min-h-[48px]"
              />
              <Button
                type="submit"
                disabled={loading}
                className="rounded-full bg-foreground px-8 py-3.5 text-background hover:bg-foreground/90 min-h-[48px]"
              >
                {loading ? "Subscribing..." : "Notify Me"}
              </Button>
            </form>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            No spam. Unsubscribe anytime. By subscribing you agree to our
            Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  );
}
