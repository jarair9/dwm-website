"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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

  // Mobile fullscreen lightbox
  const [lightbox, setLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [pinchScale, setPinchScale] = useState(1);
  const [pinchPos, setPinchPos] = useState({ x: 0, y: 0 });
  const [lastTouch, setLastTouch] = useState<{ dist: number; mid: { x: number; y: number } } | null>(null);

  const displayImages = images?.length > 0 ? images : [];

  if (displayImages.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-secondary/30">
        <svg className="h-16 w-16 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
        </svg>
      </div>
    );
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightbox(true);
    setPinchScale(1);
    setPinchPos({ x: 0, y: 0 });
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = useCallback(() => {
    setLightbox(false);
    setPinchScale(1);
    setPinchPos({ x: 0, y: 0 });
    document.body.style.overflow = "";
  }, []);

  const prevImage = useCallback(() => {
    setLightboxIndex((i) => (i > 0 ? i - 1 : displayImages.length - 1));
    setPinchScale(1);
    setPinchPos({ x: 0, y: 0 });
  }, [displayImages.length]);

  const nextImage = useCallback(() => {
    setLightboxIndex((i) => (i < displayImages.length - 1 ? i + 1 : 0));
    setPinchScale(1);
    setPinchPos({ x: 0, y: 0 });
  }, [displayImages.length]);

  // Pinch-to-zoom handlers
  const getTouchDist = (touches: TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchMid = (touches: TouchList) => ({
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      setLastTouch({ dist: getTouchDist(e.nativeEvent.touches), mid: getTouchMid(e.nativeEvent.touches) });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouch) {
      e.preventDefault();
      const newDist = getTouchDist(e.nativeEvent.touches);
      const scaleDelta = newDist / lastTouch.dist;
      setPinchScale((s) => Math.min(Math.max(s * scaleDelta, 1), 4));
      setLastTouch({ dist: newDist, mid: getTouchMid(e.nativeEvent.touches) });
    }
  };

  const handleTouchEnd = () => {
    setLastTouch(null);
    if (pinchScale <= 1.1) {
      setPinchScale(1);
      setPinchPos({ x: 0, y: 0 });
    }
  };

  // Double-tap to zoom
  const lastTapRef = useRef(0);
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (pinchScale > 1) {
        setPinchScale(1);
        setPinchPos({ x: 0, y: 0 });
      } else {
        setPinchScale(2.5);
      }
    }
    lastTapRef.current = now;
  };

  // Keyboard nav for lightbox
  useEffect(() => {
    if (!lightbox) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox, closeLightbox, prevImage, nextImage]);

  return (
    <div>
      {/* Main Image with Desktop Zoom */}
      <div
        ref={imageRef}
        className="relative aspect-square overflow-hidden rounded-2xl bg-secondary/30 cursor-zoom-in"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={handleMouseMove}
        onClick={() => openLightbox(selectedIndex)}
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
            Hover to zoom &bull; Click to expand
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

      {/* Fullscreen Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev button */}
          {displayImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-2 sm:left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next button */}
          {displayImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-2 sm:right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Image with pinch zoom */}
          <div
            className="relative h-full w-full flex items-center justify-center p-4 sm:p-8"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleDoubleTap}
          >
            <div
              className="relative h-full w-full max-w-4xl"
              style={{
                transform: `scale(${pinchScale}) translate(${pinchPos.x}px, ${pinchPos.y}px)`,
                transition: lastTouch ? "none" : "transform 0.2s ease-out",
              }}
            >
              <Image
                src={displayImages[lightboxIndex]}
                alt={`${name} ${lightboxIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                draggable={false}
              />
            </div>
          </div>

          {/* Counter */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
              {lightboxIndex + 1} / {displayImages.length}
            </div>
          )}

          {/* Zoom hint on mobile */}
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 text-xs text-white/60">
            Pinch to zoom &bull; Double-tap to zoom
          </div>
        </div>
      )}
    </div>
  );
}
