import { createClient } from "@/lib/supabase/server";

interface BidHistoryProps {
  lotId: string;
}

export async function BidHistory({ lotId }: BidHistoryProps) {
  const supabase = await createClient();

  const { data: bids } = await supabase
    .from("bid_history_public")
    .select("*")
    .eq("lot_id", lotId)
    .eq("is_revealed", true)
    .order("created_at", { ascending: false })
    .limit(10);

  const history =
    bids?.map((bid) => ({
      bidder: bid.bidder_label,
      amount: bid.amount,
      time: bid.created_at,
      eventType: bid.event_type,
    })) || [];

  if (history.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="font-serif text-lg font-semibold">Bid History</h3>
      <div className="mt-4 space-y-3">
        {history.map((bid, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border border-border/50 p-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                {bid.bidder[0]}
              </div>
              <div>
                <p className="text-sm font-medium">{bid.bidder}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(bid.time).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="font-medium">
              ${bid.amount?.toLocaleString() || "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
