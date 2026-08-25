import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();

  // Close live auctions past end_time
  const { data: closed, error: closeErr } = await supabase
    .rpc("auto_update_auction_statuses");

  if (closeErr) {
    return NextResponse.json({ error: closeErr.message }, { status: 500 });
  }

  // Also manually close any that the function missed
  const { data: expired } = await supabase
    .from("lots")
    .select("id")
    .eq("status", "live")
    .lte("end_time", new Date().toISOString());

  if (expired && expired.length > 0) {
    for (const lot of expired) {
      await supabase.rpc("close_auction", { p_lot_id: lot.id });
    }
  }

  return NextResponse.json({ ok: true, closed: expired?.length || 0 });
}
