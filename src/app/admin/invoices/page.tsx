import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InvoiceActions } from "@/components/admin/invoice-actions";

export default async function AdminInvoicesPage() {
  const supabase = await createClient();

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*, lots(name, slug)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Invoices
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage payments and invoices
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Lot
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Due Date
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices && invoices.length > 0 ? (
                    invoices.map((invoice) => {
                      const lot = invoice.lots as { name: string } | null;
                      return (
                        <tr
                          key={invoice.id}
                          className="border-b border-border/50"
                        >
                          <td className="px-4 py-3 text-sm">
                            {lot?.name || "—"}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium">
                            ${invoice.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant={
                                invoice.status === "paid"
                                  ? "default"
                                  : invoice.status === "overdue"
                                  ? "destructive"
                                  : "outline"
                              }
                              className="capitalize"
                            >
                              {invoice.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {invoice.due_at
                              ? new Date(invoice.due_at).toLocaleDateString()
                              : "—"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <InvoiceActions invoice={invoice} />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-12 text-center text-muted-foreground"
                      >
                        No invoices yet
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
