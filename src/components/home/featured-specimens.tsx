import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export async function FeaturedSpecimens() {
  const supabase = await createClient();

  const { data: lots } = await supabase
    .from("lots")
    .select("*, categories(name, slug, type)")
    .eq("featured", true)
    .in("categories.type", ["mineral", "gemstone"])
    .order("created_at", { ascending: false })
    .limit(4);

  const specimens =
    lots?.map((lot) => ({
      id: lot.id,
      slug: lot.slug,
      title: lot.name,
      image: lot.images?.[0] || "/hero-banner.png",
      price: lot.starting_bid,
      category: (lot.categories as { name: string; slug: string } | null)?.name || "",
    })) || [];

  return (
    <section className="bg-secondary/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Museum Quality
          </p>
          <h2 className="font-serif text-4xl font-bold tracking-tight text-foreground">
            Featured Lots
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Each stone is hand-selected for its exceptional quality, rarity, and
            beauty. Verified by leading gemological laboratories.
          </p>
        </div>

        {specimens.length > 0 ? (
          <div className="mt-16 grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {specimens.map((specimen) => (
              <Link
                key={specimen.id}
                href={`/products/${specimen.slug}`}
                className="group block"
              >
                <div className="overflow-hidden rounded-2xl border border-border/50 bg-white transition-all duration-300 hover:shadow-lg hover:shadow-black/5">
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary/30">
                    <Image
                      src={specimen.image}
                      alt={specimen.title}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    {specimen.category && (
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        {specimen.category}
                      </p>
                    )}
                    <h3 className="mt-1 text-sm font-bold text-foreground leading-snug line-clamp-2">
                      {specimen.title}
                    </h3>
                    <p className="mt-2 text-base font-bold text-foreground">
                      ${specimen.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-16 rounded-2xl border border-border/50 bg-white py-10 text-center">
            <p className="text-lg text-muted-foreground">
              Featured lots coming soon
            </p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/minerals"
            className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-3.5 text-sm font-medium text-foreground transition-all hover:bg-secondary"
          >
            View Full Collection
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
