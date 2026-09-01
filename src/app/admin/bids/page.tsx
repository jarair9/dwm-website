import { Metadata } from "next";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { LotStatusForm } from "@/components/admin/lot-status-form";

export const metadata: Metadata = {
  title: "Bids | Admin",
};

export default async function AdminBidsPage() {
  const supabase = await createServerClient();

  const { data: lots } = await supabase
    .from("lots")
    .select("id, name, status, current_bid, starting_bid, end_time")
    .in("status", ["live", "upcoming"])
    .order("created_at", { ascending: false });

  const lotIds = lots?.map((l) => l.id) || [];

  const { data: bids } = lotIds.length > 0
    ? await supabase
        .from("bids")
        .select("*, lots(name, slug, status, current_bid, starting_bid)")
        .in("lot_id", lotIds)
        .order("created_at", { ascending: false })
        .limit(100)
    : { data: [] };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Bids &amp; Status</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View bid history and manage lot statuses
          </p>
        </div>
      </div>

      {/* Lot Status Overview */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-foreground">Lot Status</h2>
        {lots && lots.length > 0 ? (
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-secondary/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Lot</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Starting Bid</th>
                  <th className="px-4 py-3 font-medium">Current Bid</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lots.map((lot) => (
                  <LotStatusRow key={lot.id} lot={lot} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-border/50 bg-secondary/30 py-8 text-center">
            <p className="text-muted-foreground">No lots found</p>
          </div>
        )}
      </div>

      {/* Bid History */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold text-foreground">Bid History</h2>
        {bids && bids.length > 0 ? (
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-secondary/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Bidder</th>
                  <th className="px-4 py-3 font-medium">Lot</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {bids.map((bid) => (
                  <tr key={bid.id} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium">{bid.bidder_name}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {(bid.lots as { name: string } | null)?.name || "—"}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      ${bid.amount?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {bid.created_at
                        ? new Date(bid.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-border/50 bg-secondary/30 py-8 text-center">
            <p className="text-muted-foreground">No bids yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

async function LotStatusRow({
  lot,
}: {
  lot: { id: string; name: string; status: string; current_bid: number | null; starting_bid: number };
}) {
  return (
    <tr className="border-b border-border/50 last:border-0">
      <td className="px-4 py-3 font-medium">{lot.name}</td>
      <td className="px-4 py-3">
        <Badge
          variant={
            lot.status === "live"
              ? "default"
              : lot.status === "sold"
                ? "secondary"
                : "outline"
          }
          className="capitalize"
        >
          {lot.status}
        </Badge>
      </td>
      <td className="px-4 py-3">${lot.starting_bid?.toLocaleString()}</td>
      <td className="px-4 py-3 font-medium">
        ${(lot.current_bid || lot.starting_bid)?.toLocaleString()}
      </td>
      <td className="px-4 py-3">
        <LotStatusForm lotId={lot.id} currentStatus={lot.status} endTime={(lot as Record<string, unknown>).end_time as string | undefined} />
      </td>
    </tr>
  );
}
