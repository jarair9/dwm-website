import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DeleteLotButton } from "@/components/admin/delete-lot-button";

export default async function AdminLotsPage() {
  const supabase = await createClient();

  const { data: lots } = await supabase
    .from("lots")
    .select("*, categories(name)")
    .not("status", "in", '("closed","sold","not_sold","awaiting_payment")')
    .order("created_at", { ascending: false });

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Lots
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage auction lots and specimens
          </p>
        </div>
        <Link href="/admin/lots/new">
          <Button className="rounded-full">Add New Lot</Button>
        </Link>
      </div>

      <div className="mt-8">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Starting Bid
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Current Bid
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      End Time
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lots && lots.length > 0 ? (
                    lots.map((lot) => {
                      const category = lot.categories as { name: string } | null;
                      return (
                        <tr
                          key={lot.id}
                          className="border-b border-border/50 transition-colors hover:bg-secondary/30"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {lot.images && lot.images[0] ? (
                                <img
                                  src={lot.images[0]}
                                  alt={lot.name}
                                  className="h-10 w-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-sm">
                                  💎
                                </div>
                              )}
                              <div>
                                <p className="font-medium">{lot.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {lot.slug}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {category?.name || "—"}
                          </td>
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
                          <td className="px-4 py-3 text-sm">
                            ${lot.starting_bid.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium">
                            ${(lot.current_bid || lot.starting_bid).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {new Date(lot.end_time).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <Link
                                href={`/admin/lots/${lot.id}`}
                                className="text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
                              >
                                Edit
                              </Link>
                              <DeleteLotButton lotId={lot.id} />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-12 text-center text-muted-foreground"
                      >
                        No lots found. Create your first auction lot.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
