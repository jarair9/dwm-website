import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("auth_id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Single batch call instead of per-lot RPC loop
    const { data: closedCount, error } = await supabase.rpc(
      "close_all_expired_auctions"
    );

    if (error) {
      console.error("Close expired error:", error);
      return NextResponse.json(
        { error: "Failed to close auctions" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, closed: closedCount || 0 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
