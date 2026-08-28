import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/product/product-card";

export const metadata: Metadata = {
  title: "Gemstones | Distinct Mineral World",
  description:
    "Browse our curated collection of certified gemstones — sapphires, rubies, emeralds, and more.",
};

export default async function GemstonesPage({
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
    .eq("type", "gemstone")
    .order("name");

  const categories = allCategories || [];
  const parentCategories = categories.filter((c) => !c.parent_id);
  const subCategories = categories.filter((c) => c.parent_id);

  // Track active category + its parent for highlight state
  const activeCategoryIds = new Set<string>();
  if (categoryFilter) {
    activeCategoryIds.add(categoryFilter);
    const selectedSub = subCategories.find((s) => s.id === categoryFilter);
    if (selectedSub?.parent_id) {
      activeCategoryIds.add(selectedSub.parent_id);
    }
  }

  const categoryIds = categories.map((c) => c.id);

  let query = supabase.from("lots").select("*, categories(name)").eq("type", "product");

  if (categoryFilter) {
    query = query.eq("category_id", categoryFilter);
  } else if (categoryIds.length > 0) {
    query = query.in("category_id", categoryIds);
  }

  const { data: lots } = await query.order("created_at", { ascending: false });

  const gemstones =
    lots?.map((lot) => ({
      id: lot.id,
      slug: lot.slug,
      title: lot.name,
      image: lot.images?.[0] || "/hero-banner.png",
      price: lot.starting_bid,
      category: (lot.categories as { name: string } | null)?.name || "",
    })) || [];

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || "";

  // Determine which subcategories to show
  const selectedParentId = parentCategories.find((p) =>
    subCategories.some((s) => s.parent_id === p.id && s.id === categoryFilter)
  )?.id;

  const visibleSubcategories = selectedParentId
    ? subCategories.filter((s) => s.parent_id === selectedParentId)
    : subCategories.filter((s) => s.parent_id === categoryFilter);

  const hasNoCategories = parentCategories.length === 0;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-background py-16 pt-24 lg:pt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-red-400" />
              <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground whitespace-nowrap">
                Gemstones
              </h1>
              <div className="h-px flex-1 bg-red-400" />
            </div>

            {hasNoCategories ? (
              <div className="mt-16 rounded-2xl border border-border/50 bg-secondary/30 py-20 text-center">
                <p className="text-xl font-medium text-foreground">
                  Gemstone categories coming soon
                </p>
                <p className="mt-2 max-w-md mx-auto text-muted-foreground">
                  We&apos;re curating our gemstone collection. Check back soon or
                  browse our mineral products.
                </p>
                <Link
                  href="/minerals"
                  className="mt-6 inline-flex items-center rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-all hover:bg-foreground/90"
                >
                  Browse Minerals
                </Link>
              </div>
            ) : (
              <>
                {/* Parent Category Filters */}
                {parentCategories.length > 0 && (
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                    <Link
                      href="/gemstones"
                      className={`inline-flex items-center rounded-full border px-6 py-2.5 text-sm font-medium transition-all ${
                        !categoryFilter
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-foreground hover:border-foreground/50 hover:bg-secondary"
                      }`}
                    >
                      All Gemstones
                    </Link>
                    {parentCategories.map((category) => {
                      const isActive = activeCategoryIds.has(category.id);
                      const hasSubSelected =
                        categoryFilter &&
                        subCategories.some(
                          (s) =>
                            s.parent_id === category.id &&
                            s.id === categoryFilter
                        );

                      return (
                        <Link
                          key={category.id}
                          href={`/gemstones?category=${category.id}`}
                          className={`inline-flex items-center rounded-full border px-6 py-2.5 text-sm font-medium transition-all ${
                            isActive || hasSubSelected
                              ? "border-foreground bg-foreground text-background"
                              : "border-border text-foreground hover:border-foreground/50 hover:bg-secondary"
                          }`}
                        >
                          {category.name}
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Subcategory Filters */}
                {visibleSubcategories.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <Link
                      href={
                        categoryFilter &&
                        subCategories.some((s) => s.id === categoryFilter)
                          ? `/gemstones?category=${
                              subCategories.find(
                                (s) => s.id === categoryFilter
                              )?.parent_id || categoryFilter
                            }`
                          : `/gemstones?category=${categoryFilter}`
                      }
                      className={`inline-flex items-center rounded-full border px-5 py-2 text-xs font-medium transition-all ${
                        categoryFilter &&
                        !subCategories.some((s) => s.id === categoryFilter)
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                      }`}
                    >
                      All{" "}
                      {getCategoryName(
                        visibleSubcategories[0]?.parent_id || categoryFilter
                      )}
                    </Link>
                    {visibleSubcategories.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/gemstones?category=${sub.id}`}
                        className={`inline-flex items-center rounded-full border px-5 py-2 text-xs font-medium transition-all ${
                          categoryFilter === sub.id
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                        }`}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Results */}
                {gemstones.length > 0 ? (
                  <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
                    {gemstones.map((gemstone) => (
                      <ProductCard key={gemstone.id} product={gemstone} />
                    ))}
                  </div>
                ) : (
                  <div className="mt-12 rounded-2xl border border-border/50 bg-secondary/30 py-16 text-center">
                    <p className="text-lg text-muted-foreground">
                      {categoryFilter
                        ? `No ${getCategoryName(categoryFilter)} gemstones available`
                        : "Gemstone specimens coming soon"}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
