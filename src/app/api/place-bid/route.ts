import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";

const placeBidSchema = z.object({
  auction_id: z.string().uuid("Invalid auction ID"),
  amount: z
    .number()
    .positive("Bid amount must be positive")
    .max(10_000_000, "Bid amount exceeds maximum allowed")
    .finite("Bid amount must be a finite number"),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // Rate limit: 5 bids per 10 seconds per user
    const rateLimit = await checkRateLimit(`bid:${user.id}`, 5, 10);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many bid attempts. Please wait a moment.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    const parsed = placeBidSchema.safeParse(body);
    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message || "Invalid request data";
      return NextResponse.json(
        { success: false, message },
        { status: 400 }
      );
    }

    const { auction_id, amount } = parsed.data;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone")
      .eq("auth_id", user.id)
      .single();

    if (!profile?.full_name || !profile?.email || !profile?.phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete your profile before placing a bid",
          requiresProfile: true,
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc("place_bid", {
      p_auction_id: auction_id,
      p_bidder_id: profile.id,
      p_amount: amount,
    });

    if (error) {
      console.error("RPC error:", error.message);
      return NextResponse.json(
        { success: false, message: "Failed to place bid" },
        { status: 500 }
      );
    }

    if (!data?.success) {
      return NextResponse.json(
        {
          success: false,
          message: data?.message || "Bid failed",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Bid placed successfully",
      new_end_time: data.new_end_time,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
