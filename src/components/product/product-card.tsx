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
      <div className="overflow-hidden rounded-xl bg-white transition-all duration-300 hover:shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary/30">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 20vw"
          />
          <div className="absolute top-2 right-2">
            <FavoriteButton lotId={product.id} />
          </div>
        </div>
        <div className="p-2 sm:p-3 text-center">
          <h3 className="text-[11px] sm:text-xs font-bold text-foreground leading-snug line-clamp-2">
            {product.title}
          </h3>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-bold text-ruby">
            ${product.price.toLocaleString()}
          </p>
          <span className="text-[9px] sm:text-[10px] font-medium text-muted-foreground">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
