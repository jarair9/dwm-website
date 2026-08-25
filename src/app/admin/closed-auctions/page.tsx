import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClosedAuctionActions } from "@/components/admin/closed-auction-actions";

export const metadata = {
  title: "Closed Auctions | Admin",
};

export default async function AdminClosedAuctionsPage() {
  const supabase = await createClient();

  const { data: lots } = await supabase
    .from("lots")
    .select("*, categories(name)")
    .in("status", ["closed", "sold", "not_sold", "awaiting_payment"])
    .order("end_time", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Closed Auctions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage sold, unsold, and awaiting payment lots
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        {[
          { label: "Closed", status: "closed", color: "bg-gray-100 text-gray-700" },
          { label: "Awaiting Payment", status: "awaiting_payment", color: "bg-amber-100 text-amber-700" },
          { label: "Sold", status: "sold", color: "bg-emerald-100 text-emerald-700" },
          { label: "Not Sold", status: "not_sold", color: "bg-red-100 text-red-700" },
        ].map((item) => {
          const count = lots?.filter((l) => l.status === item.status).length || 0;
          return (
            <Card key={item.status}>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{count}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Lots List */}
      <div className="mt-8 space-y-4">
        {lots && lots.length > 0 ? (
          lots.map((lot) => (
            <Card key={lot.id}>
              <CardContent className="flex items-center gap-6 p-4">
                {/* Image */}
                {lot.images?.[0] ? (
                  <img
                    src={lot.images[0]}
                    alt={lot.name}
                    className="h-20 w-28 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-20 w-28 rounded-lg bg-secondary/30" />
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium truncate">{lot.name}</h3>
                    <Badge variant="outline" className="capitalize shrink-0">
                      {lot.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="mt-1 flex gap-4 text-sm text-muted-foreground">
                    <span>Starting: ${lot.starting_bid?.toLocaleString()}</span>
                    <span>Current: ${(lot.current_bid || lot.starting_bid)?.toLocaleString()}</span>
                    {lot.end_time && (
                      <span>Ended: {new Date(lot.end_time).toLocaleDateString()}</span>
                    )}
                  </div>
                  {lot.categories?.name && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Category: {lot.categories.name}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <ClosedAuctionActions lotId={lot.id} currentStatus={lot.status} />
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="rounded-2xl border border-border/50 bg-secondary/30 py-16 text-center">
            <p className="text-lg text-muted-foreground">No closed auctions yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
