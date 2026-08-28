"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface Banner {
  id: string;
  image: string;
  mobile_image?: string | null;
  title: string | null;
  description: string | null;
  cta_label: string | null;
  cta_url: string | null;
}

interface HeroSettings {
  hero_headline: string | null;
  hero_heading_line2: string | null;
  hero_subheadline: string | null;
  hero_cta_label: string | null;
  hero_cta_url: string | null;
  hero_cta2_label: string | null;
  hero_cta2_url: string | null;
  hero_stat1_value: string | null;
  hero_stat1_label: string | null;
  hero_stat2_value: string | null;
  hero_stat2_label: string | null;
  hero_stat3_value: string | null;
  hero_stat3_label: string | null;
}

const DEFAULT_SETTINGS: HeroSettings = {
  hero_headline: null,
  hero_heading_line2: null,
  hero_subheadline: null,
  hero_cta_label: null,
  hero_cta_url: null,
  hero_cta2_label: null,
  hero_cta2_url: null,
  hero_stat1_value: null,
  hero_stat1_label: null,
  hero_stat2_value: null,
  hero_stat2_label: null,
  hero_stat3_value: null,
  hero_stat3_label: null,
};

export function Hero() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [settings, setSettings] = useState<HeroSettings>(DEFAULT_SETTINGS);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase
        .from("banners")
        .select("id, image, mobile_image, title, description, cta_label, cta_url")
        .eq("page_type", "home")
        .order("sort_order", { ascending: true }),
      supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single(),
    ]).then(([desktopRes, settingsRes]) => {
      setBanners(desktopRes.data || []);
      if (settingsRes.data) {
        const d = settingsRes.data;
        setSettings({
          hero_headline: d.hero_headline ?? null,
          hero_heading_line2: d.hero_heading_line2 ?? null,
          hero_subheadline: d.hero_subheadline ?? null,
          hero_cta_label: d.hero_cta_label ?? null,
          hero_cta_url: d.hero_cta_url ?? null,
          hero_cta2_label: d.hero_cta2_label ?? null,
          hero_cta2_url: d.hero_cta2_url ?? null,
          hero_stat1_value: d.hero_stat1_value ?? null,
          hero_stat1_label: d.hero_stat1_label ?? null,
          hero_stat2_value: d.hero_stat2_value ?? null,
          hero_stat2_label: d.hero_stat2_label ?? null,
          hero_stat3_value: d.hero_stat3_value ?? null,
          hero_stat3_label: d.hero_stat3_label ?? null,
        });
      }
      setLoading(false);
    });
  }, []);

  // Desktop auto-scroll
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (loading) return <LoadingSkeleton settings={settings} />;

  const banner = banners[current] || null;
  const hasBanners = banners.length > 0;

  return (
    <>
      {/* Mobile */}
      <section className="relative block sm:hidden w-full bg-white">
        <div className="relative w-full">
          {hasBanners ? (
            <>
              {banners.map((b, i) => {
                const imgSrc = b.mobile_image || b.image;
                return (
                  <div
                    key={b.id}
                    className="relative w-full transition-opacity duration-1000"
                    style={{
                      opacity: i === current ? 1 : 0,
                      pointerEvents: i === current ? "auto" : "none",
                      display: i === current ? "block" : "none",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgSrc}
                      alt={b.title || "Distinct Mineral World"}
                      className="w-full h-auto"
                    />
                  </div>
                );
              })}
              {banners.length > 1 && (
                <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                  {banners.map((b, i) => (
                    <button
                      key={b.id}
                      onClick={() => setCurrent(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === current ? "w-8 bg-black" : "w-2 bg-black/30"
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-48 bg-secondary/30" />
          )}
        </div>
        <Stats settings={settings} />
      </section>

      {/* Desktop — banner carousel with text */}
      <section className="relative hidden sm:block w-full h-[calc(100vh-64px)] overflow-hidden bg-white">
        {/* SEO H1 — visually hidden */}
        <h1 className="sr-only">Distinct Mineral World — Rare Gemstone Auctions</h1>

        {banners.map((b, i) =>
          b.image ? (
            <div
              key={b.id}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{
                opacity: i === current ? 1 : 0,
                pointerEvents: i === current ? "auto" : "none",
              }}
            >
              <Image
                src={b.image}
                alt={b.title || "Distinct Mineral World"}
                fill
                className="object-cover object-center"
                priority={i === 0}
                sizes="100vw"
              />
            </div>
          ) : null
        )}

        {banners.length === 0 && (
          <div className="absolute inset-0 bg-secondary/30" />
        )}

        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {banners.map((b, i) => (
              <button
                key={b.id}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current ? "w-8 bg-black" : "w-2 bg-black/30"
                }`}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function LoadingSkeleton({ settings }: { settings: HeroSettings }) {
  return (
    <>
      <section className="relative block sm:hidden w-full bg-white">
        <div className="relative w-full h-48 bg-secondary/30" />
        <Stats settings={settings} />
      </section>
      <section className="relative hidden sm:block w-full pt-16 overflow-hidden bg-secondary/30">
        <div className="relative z-10">
          <div className="mx-auto flex w-full max-w-7xl px-6 py-8">
            <div className="max-w-2xl">
              {settings.hero_headline && (
                <h1 className="font-serif text-5xl font-bold leading-[1.1] tracking-tight text-black md:text-6xl lg:text-7xl">
                  {settings.hero_headline}
                  {settings.hero_heading_line2 && (
                    <>
                      <br />
                      <span className="text-black/70">{settings.hero_heading_line2}</span>
                    </>
                  )}
                </h1>
              )}
              {settings.hero_subheadline && (
                <p className="mt-6 max-w-md text-lg leading-relaxed text-black/70">
                  {settings.hero_subheadline}
                </p>
              )}
              {(settings.hero_cta_label || settings.hero_cta2_label) && (
                <div className="mt-10 flex items-center gap-4">
                  {settings.hero_cta_label && (
                    <Link
                      href={settings.hero_cta_url || "/auctions"}
                      className="rounded-full bg-black px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-black/80 hover:shadow-lg"
                    >
                      {settings.hero_cta_label}
                    </Link>
                  )}
                  {settings.hero_cta2_label && (
                    <Link
                      href={settings.hero_cta2_url || "/minerals"}
                      className="rounded-full border border-black/20 px-8 py-3.5 text-sm font-medium text-black transition-all hover:bg-black/5"
                    >
                      {settings.hero_cta2_label}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
          <Stats settings={settings} />
        </div>
      </section>
    </>
  );
}

function Stats({ settings }: { settings: HeroSettings }) {
  const stats = [
    { value: settings.hero_stat1_value, label: settings.hero_stat1_label },
    { value: settings.hero_stat2_value, label: settings.hero_stat2_label },
    { value: settings.hero_stat3_value, label: settings.hero_stat3_label },
  ].filter((s) => s.value && s.label);

  if (stats.length === 0) return null;

  return (
    <div className="border-t border-black/10 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-12 px-6 py-6">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-12">
            <div className="text-center">
              <p className="font-serif text-2xl font-bold text-black">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-black/60">{stat.label}</p>
            </div>
            {i < stats.length - 1 && <div className="h-8 w-px bg-black/10" />}
          </div>
        ))}
      </div>
    </div>
  );
}
