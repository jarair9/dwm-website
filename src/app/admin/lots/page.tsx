import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AdminLotFilters } from "@/components/admin/admin-lot-filters";

export default async function AdminLotsPage() {
  const supabase = await createClient();

  const { data: lots } = await supabase
    .from("lots")
    .select("*, categories(name, type)")
    .eq("type", "lot")
    .order("created_at", { ascending: false });

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, type, parent_id")
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

      <AdminLotFilters lots={lots ?? []} categories={categories ?? []} />
    </div>
  );
}
