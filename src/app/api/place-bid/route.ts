import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify authentication
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

    const body = await request.json();
    const { auction_id, amount } = body;

    if (!auction_id || !amount) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user has completed profile
    const { data: profile } = await supabase
      .from("users")
      .select("full_name, email, phone")
      .eq("id", user.id)
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

    // Call the place_bid RPC function
    // Note: In production, use service_role key for this call
    // For now, we'll use the anon key since the RPC is security definer
    const { data, error } = await supabase.rpc("place_bid", {
      p_auction_id: auction_id,
      p_bidder_id: user.id,
      p_amount: amount,
    });

    if (error) {
      console.error("RPC error:", error);
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
  } catch (error) {
    console.error("Place bid error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
