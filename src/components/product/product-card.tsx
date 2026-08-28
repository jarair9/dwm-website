"use client";

import Link from "next/link";
import Image from "next/image";
import { FavoriteButton } from "./favorite-button";

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    title: string;
    image: string;
    price: number;
    category?: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-white transition-all duration-300 hover:shadow-lg hover:shadow-black/5">
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary/30">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 20vw"
          />
          {product.category && (
            <div className="absolute top-2 left-2">
              <span className="inline-flex rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur-sm">
                {product.category}
              </span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <FavoriteButton lotId={product.id} />
          </div>
        </div>
        <div className="p-3 sm:p-4 text-center">
          <h3 className="text-xs sm:text-sm font-bold text-foreground leading-snug line-clamp-2">
            {product.title}
          </h3>
          <div className="mt-2 pt-2 border-t border-border/50">
            <p className="text-sm sm:text-base font-bold text-foreground">
              ${product.price.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
