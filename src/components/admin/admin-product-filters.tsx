"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DeleteLotButton } from "@/components/admin/delete-lot-button";

interface Lot {
  id: string;
  name: string;
  slug: string;
  status: string;
  starting_bid: number;
  current_bid: number | null;
  images: string[];
  video_url: string | null;
  featured: boolean;
  category_id: string | null;
  categories: { name: string; type: string } | null;
}

interface Category {
  id: string;
  name: string;
  type: string;
  parent_id: string | null;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "live", label: "Live" },
  { value: "not_sold", label: "Not Sold" },
  { value: "awaiting_payment", label: "Awaiting Payment" },
  { value: "sold", label: "Sold" },
  { value: "closed", label: "Closed" },
];

export function AdminProductFilters({
  products,
  categories,
}: {
  products: Lot[];
  categories: Category[];
}) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return products.filter((lot) => {
      if (statusFilter !== "all" && lot.status !== statusFilter) return false;
      if (typeFilter !== "all") {
        const lotType = lot.categories?.type;
        if (typeFilter === "none") {
          if (lot.category_id !== null) return false;
        } else if (lotType !== typeFilter) {
          return false;
        }
      }
      if (search) {
        const q = search.toLowerCase();
        if (
          !lot.name.toLowerCase().includes(q) &&
          !lot.slug.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [products, statusFilter, typeFilter, search]);

  return (
    <div className="mt-8 space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="all">All Types</option>
          <option value="mineral">Mineral</option>
          <option value="gemstone">Gemstone</option>
          <option value="none">No Category</option>
        </select>
        <span className="text-sm text-muted-foreground">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/50">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-border/50 last:border-0 transition-colors hover:bg-secondary/30">
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
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        product.status === "live"
                          ? "default"
                          : product.status === "sold"
                          ? "secondary"
                          : "outline"
                      }
                      className="capitalize"
                    >
                      {product.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    ${(product.current_bid || product.starting_bid).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {product.featured ? (
                      <Badge variant="default">Featured</Badge>
                    ) : (
                      <Badge variant="outline">—</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
                      >
                        Edit
                      </Link>
                      <DeleteLotButton
                        lotId={product.id}
                        images={product.images}
                        videoUrl={product.video_url}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-border/50 bg-secondary/30 py-16 text-center">
          <p className="text-lg text-muted-foreground">
            {products.length === 0
              ? "No products yet"
              : "No products match your filters"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Add minerals and gemstones for direct sale
          </p>
        </div>
      )}
    </div>
  );
}
