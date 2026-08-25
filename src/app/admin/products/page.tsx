import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Products | Admin",
};

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: lots } = await supabase
    .from("lots")
    .select("*, categories(name, type)")
    .in("status", ["live", "upcoming", "sold"])
    .order("created_at", { ascending: false });

  const products =
    lots?.filter((lot) => {
      const type = lot.categories?.type;
      return type === "mineral" || type === "gemstone";
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

      {products.length > 0 ? (
        <div className="mt-8 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/50">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] ? (
                        <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                          <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-lg">
                          💎
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="capitalize">
                      {product.categories?.type || "—"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {product.categories?.name || "—"}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    ${product.current_bid || product.starting_bid}
                  </td>
                  <td className="px-4 py-3">
                    {product.featured ? (
                      <Badge variant="default">Featured</Badge>
                    ) : (
                      <Badge variant="outline">—</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-border/50 bg-secondary/30 py-16 text-center">
          <p className="text-lg text-muted-foreground">No products yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Add minerals and gemstones for direct sale
          </p>
        </div>
      )}
    </div>
  );
}
