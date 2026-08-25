"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Category {
  name: string;
  slug: string;
  type: string;
  imageUrl: string | null;
}

interface CategoriesProps {
  categories: Category[];
}

export function Categories({ categories }: CategoriesProps) {
  const [showAll, setShowAll] = useState(false);
  const initialCount = 8;
  const visibleCategories = showAll ? categories : categories.slice(0, initialCount);
  const hasMore = categories.length > initialCount;

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Explore
          </p>
          <h2 className="font-serif text-4xl font-bold tracking-tight text-foreground">
            Categories
          </h2>
        </div>

        {categories.length > 0 ? (
          <>
            <div className={`mt-16 grid gap-8 ${categories.length === 1 ? "grid-cols-1 justify-items-center max-w-xs mx-auto" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"}`}>
              {visibleCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={
                    category.type === "mineral"
                      ? "/minerals"
                      : category.type === "gemstone"
                        ? "/gemstones"
                        : "/minerals"
                  }
                  className="group flex flex-col items-center"
                >
                  <div className="relative h-40 w-40 overflow-hidden rounded-[2rem] border-2 border-border/50 bg-secondary/30 transition-all duration-300 group-hover:border-foreground/30 group-hover:shadow-xl group-hover:shadow-black/10 group-hover:scale-105">
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-5xl">💎</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-4 text-center text-sm font-semibold text-foreground transition-colors group-hover:text-muted-foreground">
                    {category.name}
                  </p>
                </Link>
              ))}
            </div>

            {hasMore && !showAll && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setShowAll(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-secondary"
                >
                  View More
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}

            {showAll && hasMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setShowAll(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-secondary"
                >
                  Show Less
                  <svg className="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="mt-16 rounded-2xl border border-border/50 bg-secondary/30 py-16 text-center">
            <p className="text-muted-foreground">Categories coming soon</p>
          </div>
        )}
      </div>
    </section>
  );
}
