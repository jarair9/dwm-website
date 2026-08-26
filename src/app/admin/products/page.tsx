import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminProductFilters } from "@/components/admin/admin-product-filters";

export const metadata: Metadata = {
  title: "Products | Admin",
};

export default async function AdminProductsPage() {
  const supabase = await createClient();

  // Fetch all lots — client component filters to mineral/gemstone only
  const { data: lots } = await supabase
    .from("lots")
    .select("*, categories(name, type)")
    .eq("type", "product")
    .order("created_at", { ascending: false });

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, type, parent_id")
    .order("name");

  // Filter to mineral/gemstone only on server (categories with no category also shown)
  const products =
    lots?.filter((lot) => {
      const type = lot.categories?.type;
      return !type || type === "mineral" || type === "gemstone";
    }) || [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Minerals &amp; Gemstones — direct sell (no auction)
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        >
          Add Product
        </Link>
      </div>

      <AdminProductFilters products={products} categories={categories ?? []} />
    </div>
  );
}
