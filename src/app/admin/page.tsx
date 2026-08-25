import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [lotsResult, bidsResult, messagesResult, subscribersResult] =
    await Promise.all([
      supabase.from("lots").select("id, status, current_bid, starting_bid"),
      supabase.from("bids").select("id, amount"),
      supabase.from("contact_messages").select("id, resolved"),
      supabase.from("newsletter_subscribers").select("id"),
    ]);

  const lots = lotsResult.data || [];
  const bids = bidsResult.data || [];
  const messages = messagesResult.data || [];
  const subscribers = subscribersResult.data || [];

  const stats = {
    totalLots: lots.length,
    liveLots: lots.filter((l) => l.status === "live").length,
    upcomingLots: lots.filter((l) => l.status === "upcoming").length,
    soldLots: lots.filter((l) => l.status === "sold").length,
    totalBids: bids.length,
    totalVolume: lots.reduce(
      (sum, l) => sum + (l.current_bid || l.starting_bid),
      0
    ),
    unresolvedMessages: messages.filter((m) => !m.resolved).length,
    subscribers: subscribers.length,
  };

  const { data: recentBids } = await supabase
    .from("bids")
    .select("id, amount, bidder_name, created_at, lots(name, slug)")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentLots } = await supabase
    .from("lots")
    .select("id, name, slug, status, current_bid, starting_bid, end_time")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
        Dashboard
      </h1>
      <p className="mt-2 text-muted-foreground">
        Overview of your auction house
      </p>

      {/* Stats Grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Lots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-serif text-3xl font-bold">{stats.totalLots}</p>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline" className="text-xs">
                {stats.liveLots} live
              </Badge>
              <Badge variant="outline" className="text-xs">
                {stats.upcomingLots} upcoming
              </Badge>
              <Badge variant="outline" className="text-xs">
                {stats.soldLots} sold
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bids
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-serif text-3xl font-bold">{stats.totalBids}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Across all auctions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-serif text-3xl font-bold">
              ${stats.totalVolume.toLocaleString()}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Combined current bids
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-serif text-3xl font-bold">
              {stats.subscribers}
            </p>
            {stats.unresolvedMessages > 0 && (
              <Badge variant="destructive" className="mt-2 text-xs">
                {stats.unresolvedMessages} unresolved messages
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent Lots */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Lots</CardTitle>
            <Link
              href="/admin/lots"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentLots && recentLots.length > 0 ? (
              <div className="space-y-3">
                {recentLots.map((lot) => (
                  <Link
                    key={lot.id}
                    href={`/admin/lots/${lot.id}`}
                    className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition-colors hover:bg-secondary/50"
                  >
                    <div>
                      <p className="font-medium">{lot.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Ends: {new Date(lot.end_time).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
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
                      <p className="mt-1 text-sm font-medium">
                        ${(lot.current_bid || lot.starting_bid).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">
                No lots yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Bids */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Bids</CardTitle>
            <Link
              href="/admin/invoices"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              View invoices
            </Link>
          </CardHeader>
          <CardContent>
            {recentBids && recentBids.length > 0 ? (
              <div className="space-y-3">
                {recentBids.map((bid) => {
                  const lot = bid.lots as unknown as { name: string; slug: string } | null;
                  return (
                    <div
                      key={bid.id}
                      className="flex items-center justify-between rounded-lg border border-border/50 p-3"
                    >
                      <div>
                        <p className="font-medium">{bid.bidder_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {lot?.name || "Unknown lot"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${bid.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(bid.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">
                No bids yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
