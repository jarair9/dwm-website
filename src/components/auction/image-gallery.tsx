"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface ImageGalleryProps {
  images: string[];
  name: string;
  status: string;
}

export function ImageGallery({ images, name, status }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);
  const displayImages = images.length > 0 ? images : ["/hero-banner.png"];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  return (
    <div>
      {/* Main Image with Zoom */}
      <div
        ref={imageRef}
        className="relative aspect-square overflow-hidden rounded-2xl bg-secondary/30 cursor-zoom-in"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={displayImages[selectedIndex]}
          alt={name}
          fill
          className="object-cover transition-transform duration-200 ease-out"
          style={{
            transform: zoom ? "scale(2)" : "scale(1)",
            transformOrigin: `${position.x}% ${position.y}%`,
          }}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
        {status === "live" && (
          <Badge
            variant="secondary"
            className="absolute top-4 left-4 bg-white/90 text-foreground backdrop-blur-sm"
          >
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            Live
          </Badge>
        )}
        {zoom && (
          <div className="absolute bottom-4 left-4 rounded-lg bg-black/70 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
            Hover to zoom • Move mouse to pan
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                selectedIndex === i
                  ? "border-foreground"
                  : "border-border/50 hover:border-border"
              }`}
            >
              <Image
                src={img}
                alt={`${name} ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
