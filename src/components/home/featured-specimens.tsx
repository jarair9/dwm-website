import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export async function FeaturedSpecimens() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("lots")
    .select("id, slug, name, images, starting_bid, categories(name, slug, type)")
    .eq("type", "product")
    .in("categories.type", ["mineral", "gemstone"])
    .order("created_at", { ascending: false })
    .limit(4);

  const specimens =
    products?.map((product) => ({
      id: product.id,
      slug: product.slug,
      title: product.name,
      image: product.images?.[0] || "/hero-banner.png",
      price: product.starting_bid,
      category: (product.categories as unknown as { name: string; slug: string; type: string } | null)?.name || "",
      categoryType: (product.categories as unknown as { name: string; slug: string; type: string } | null)?.type || "",
    })) || [];

  return (
    <section className="bg-secondary/30 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-red-400" />
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground whitespace-nowrap">
            Fixed Price
          </h2>
          <div className="h-px flex-1 bg-red-400" />
        </div>

        {specimens.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {specimens.map((specimen) => (
              <Link
                key={specimen.id}
                href={`/products/${specimen.slug}`}
                className="group block"
              >
                <div className="overflow-hidden rounded-2xl border border-border/50 bg-white transition-all duration-300 hover:shadow-lg hover:shadow-black/5">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary/30">
                    <Image
                      src={specimen.image}
                      alt={specimen.title}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    {specimen.category && (
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        {specimen.category}
                      </p>
                    )}
                    <h3 className="mt-1 text-xs sm:text-sm font-bold text-foreground leading-snug line-clamp-2">
                      {specimen.title}
                    </h3>
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <p className="text-[10px] text-muted-foreground">Buy Now</p>
                      <p className="text-sm sm:text-base font-bold text-foreground">
                        ${specimen.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border/50 bg-white py-10 text-center">
            <p className="text-lg text-muted-foreground">
              Fixed price products coming soon
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/minerals"
            className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-3.5 text-sm font-medium text-foreground transition-all hover:bg-secondary"
          >
            View Full Collection
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
