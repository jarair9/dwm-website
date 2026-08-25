import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/product-card";

export const metadata: Metadata = {
  title: "Minerals | Distinct Mineral World",
  description:
    "Explore our curated collection of rare mineral specimens from around the world.",
};

export default async function MineralsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const categoryFilter = params.category || "";

  const supabase = await createClient();

  const { data: allCategories } = await supabase
    .from("categories")
    .select("*")
    .eq("type", "mineral")
    .order("name");

  const parentCategories = allCategories?.filter((c) => !c.parent_id) || [];
  const subCategories = allCategories?.filter((c) => c.parent_id) || [];

  const categoryIds = allCategories?.map((c) => c.id) || [];

  let query = supabase.from("lots").select("*, categories(name)");

  if (categoryFilter) {
    query = query.eq("category_id", categoryFilter);
  } else if (categoryIds.length > 0) {
    query = query.in("category_id", categoryIds);
  }

  const { data: lots } = await query
    .order("created_at", { ascending: false });

  const minerals =
    lots?.map((lot) => ({
      id: lot.id,
      slug: lot.slug,
      title: lot.name,
      image: lot.images?.[0] || "/hero-banner.png",
      price: lot.starting_bid,
      category: (lot.categories as { name: string } | null)?.name || "",
    })) || [];

  const getCategoryName = (id: string) =>
    allCategories?.find((c) => c.id === id)?.name || "";

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-background py-16 pt-24 lg:pt-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Collection
              </p>
              <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground">
                Minerals
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Discover rare mineral specimens — each one a natural wonder
                formed over millions of years.
              </p>
            </div>

            {/* Parent Category Filters */}
            {parentCategories.length > 0 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                <Link href="/minerals">
                  <Badge
                    variant={!categoryFilter ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 text-sm"
                  >
                    All Minerals
                  </Badge>
                </Link>
                {parentCategories.map((category) => (
                  <Link key={category.id} href={`/minerals?category=${category.id}`}>
                    <Badge
                      variant={categoryFilter === category.id ? "default" : "outline"}
                      className="cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-foreground hover:text-background"
                    >
                      {category.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}

            {/* Subcategory Filters */}
            {categoryFilter && subCategories.filter((s) => s.parent_id === categoryFilter).length > 0 && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <Link href={`/minerals?category=${categoryFilter}`}>
                  <Badge variant="default" className="cursor-pointer px-3 py-1.5 text-xs">
                    All {getCategoryName(categoryFilter)}
                  </Badge>
                </Link>
                {subCategories
                  .filter((s) => s.parent_id === categoryFilter)
                  .map((sub) => (
                    <Link key={sub.id} href={`/minerals?category=${sub.id}`}>
                      <Badge
                        variant={categoryFilter === sub.id ? "default" : "outline"}
                        className="cursor-pointer px-3 py-1.5 text-xs transition-colors hover:bg-foreground hover:text-background"
                      >
                        {sub.name}
                      </Badge>
                    </Link>
                  ))}
              </div>
            )}

            {minerals.length > 0 ? (
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {minerals.map((mineral) => (
                  <ProductCard key={mineral.id} product={mineral} />
                ))}
              </div>
            ) : (
              <div className="mt-12 rounded-2xl border border-border/50 bg-secondary/30 py-16 text-center">
                <p className="text-lg text-muted-foreground">
                  {categoryFilter
                    ? `No ${getCategoryName(categoryFilter)} minerals available`
                    : "Mineral specimens coming soon"}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
