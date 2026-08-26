"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteLotButton } from "@/components/admin/delete-lot-button";

interface Lot {
  id: string;
  name: string;
  slug: string;
  status: string;
  starting_bid: number;
  current_bid: number | null;
  end_time: string;
  images: string[];
  video_url: string | null;
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

export function AdminLotFilters({
  lots,
  categories,
}: {
  lots: Lot[];
  categories: Category[];
}) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return lots.filter((lot) => {
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
  }, [lots, statusFilter, typeFilter, search]);

  return (
    <div className="mt-8 space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search lots..."
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
          {filtered.length} lot{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
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
                {filtered.length > 0 ? (
                  filtered.map((lot) => {
                    const category = lot.categories as { name: string; type: string } | null;
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
                          {category ? (
                            <span className="flex items-center gap-1.5">
                              <Badge variant="outline" className="text-xs capitalize">
                                {category.type}
                              </Badge>
                              {category.name}
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic">None</span>
                          )}
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
                            {lot.status.replace("_", " ")}
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
                            <DeleteLotButton
                              lotId={lot.id}
                              images={lot.images}
                              videoUrl={lot.video_url}
                            />
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
                      {lots.length === 0
                        ? "No lots found. Create your first auction lot."
                        : "No lots match your filters."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
