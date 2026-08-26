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
  hero_headline: string;
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
  hero_headline: "Rare Minerals.",
  hero_heading_line2: "Exceptional Craft.",
  hero_subheadline: null,
  hero_cta_label: "Enter Auction",
  hero_cta_url: "/auctions",
  hero_cta2_label: "View Collection",
  hero_cta2_url: "/minerals",
  hero_stat1_value: "200+",
  hero_stat1_label: "Specimens Sold",
  hero_stat2_value: "50+",
  hero_stat2_label: "Countries",
  hero_stat3_value: "$2M+",
  hero_stat3_label: "Total Volume",
};

export function Hero() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [mobileBanners, setMobileBanners] = useState<Banner[]>([]);
  const [settings, setSettings] = useState<HeroSettings>(DEFAULT_SETTINGS);
  const [current, setCurrent] = useState(0);
  const [mobileCurrent, setMobileCurrent] = useState(0);
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
        .from("banners")
        .select("id, image, mobile_image, title, description, cta_label, cta_url")
        .eq("page_type", "home")
        .not("mobile_image", "is", null)
        .order("sort_order", { ascending: true }),
      supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single(),
    ]).then(([desktopRes, mobileRes, settingsRes]) => {
      const defaultBanner: Banner = {
        id: "default",
        image: "/hero-banner.png",
        mobile_image: null,
        title: null,
        description: null,
        cta_label: "Enter Auction",
        cta_url: "/auctions",
      };
      setBanners([defaultBanner, ...(desktopRes.data || [])]);
      setMobileBanners(mobileRes.data || []);
      if (settingsRes.data) {
        setSettings({
          hero_headline: settingsRes.data.hero_headline || DEFAULT_SETTINGS.hero_headline,
          hero_heading_line2: settingsRes.data.hero_heading_line2 || DEFAULT_SETTINGS.hero_heading_line2,
          hero_subheadline: settingsRes.data.hero_subheadline,
          hero_cta_label: settingsRes.data.hero_cta_label || DEFAULT_SETTINGS.hero_cta_label,
          hero_cta_url: settingsRes.data.hero_cta_url || DEFAULT_SETTINGS.hero_cta_url,
          hero_cta2_label: settingsRes.data.hero_cta2_label,
          hero_cta2_url: settingsRes.data.hero_cta2_url,
          hero_stat1_value: settingsRes.data.hero_stat1_value,
          hero_stat1_label: settingsRes.data.hero_stat1_label,
          hero_stat2_value: settingsRes.data.hero_stat2_value,
          hero_stat2_label: settingsRes.data.hero_stat2_label,
          hero_stat3_value: settingsRes.data.hero_stat3_value,
          hero_stat3_label: settingsRes.data.hero_stat3_label,
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

  // Mobile auto-scroll
  useEffect(() => {
    if (mobileBanners.length <= 1) return;
    const timer = setInterval(() => {
      setMobileCurrent((prev) => (prev + 1) % mobileBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [mobileBanners.length]);

  if (loading) return <LoadingSkeleton settings={settings} />;

  const banner = banners[current];
  const hasMobileBanners = mobileBanners.length > 0;

  return (
    <>
      {/* Mobile */}
      <section className="relative block sm:hidden w-full bg-white">
        <div className="relative h-[80vh]">
          {hasMobileBanners ? (
            <>
              {mobileBanners.map((b, i) => (
                <div
                  key={b.id}
                  className="absolute inset-0 transition-opacity duration-1000"
                  style={{
                    opacity: i === mobileCurrent ? 1 : 0,
                    pointerEvents: i === mobileCurrent ? "auto" : "none",
                  }}
                >
                  <Image
                    src={b.mobile_image!}
                    alt={b.title || "Banner"}
                    fill
                    className="object-cover object-center"
                    priority={i === 0}
                    sizes="100vw"
                  />
                </div>
              ))}
              <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                {mobileBanners.map((b, i) => (
                  <button
                    key={b.id}
                    onClick={() => setMobileCurrent(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === mobileCurrent ? "w-8 bg-black" : "w-2 bg-black/30"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            <Image
              src="/mobile-view.png"
              alt="Distinct Mineral World"
              fill
              className="object-contain"
              priority
              sizes="100vw"
            />
          )}
        </div>
        <Stats settings={settings} />
      </section>

      {/* Desktop — banner carousel with text */}
      <section className="relative hidden sm:block h-screen w-full overflow-hidden bg-white">
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
                alt={b.title || "Banner"}
                fill
                className="object-cover object-center"
                priority={i === 0}
                sizes="100vw"
              />
            </div>
          ) : null
        )}

        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="h-16" />
          <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-6">
            <div className="max-w-2xl">
              {banner.title && (
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-black/70">
                  {banner.title}
                </p>
              )}
              <h1 className="font-serif text-5xl font-bold leading-[1.1] tracking-tight text-black md:text-6xl lg:text-7xl">
                {settings.hero_headline}
                {settings.hero_heading_line2 && (
                  <>
                    <br />
                    <span className="text-black/70">{settings.hero_heading_line2}</span>
                  </>
                )}
              </h1>
              {(banner.description || settings.hero_subheadline) && (
                <p className="mt-6 max-w-md text-lg leading-relaxed text-black/70">
                  {banner.description || settings.hero_subheadline}
                </p>
              )}
              <div className="mt-10 flex items-center gap-4">
                <Link
                  href={banner.cta_url || settings.hero_cta_url || "/auctions"}
                  className="rounded-full bg-black px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-black/80 hover:shadow-lg"
                >
                  {banner.cta_label || settings.hero_cta_label || "Enter Auction"}
                </Link>
                {settings.hero_cta2_label && (
                  <Link
                    href={settings.hero_cta2_url || "/minerals"}
                    className="rounded-full border border-black/20 px-8 py-3.5 text-sm font-medium text-black transition-all hover:bg-black/5"
                  >
                    {settings.hero_cta2_label}
                  </Link>
                )}
              </div>
            </div>
          </div>

          {banners.length > 1 && (
            <div className="absolute bottom-28 left-1/2 z-20 flex -translate-x-1/2 gap-2">
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

          <Stats settings={settings} />
        </div>
      </section>
    </>
  );
}

function LoadingSkeleton({ settings }: { settings: HeroSettings }) {
  return (
    <>
      <section className="relative block sm:hidden w-full bg-white">
        <div className="relative h-[80vh]">
          <Image
            src="/mobile-view.png"
            alt="Distinct Mineral World"
            fill
            className="object-contain"
            priority
            sizes="100vw"
          />
        </div>
        <Stats settings={settings} />
      </section>
      <section className="relative hidden sm:block h-screen w-full overflow-hidden bg-white">
        <Image
          src="/hero-banner.png"
          alt="Rare blue sapphire gemstone"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="h-16" />
          <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-6">
            <div className="max-w-2xl">
              <h1 className="font-serif text-5xl font-bold leading-[1.1] tracking-tight text-black md:text-6xl lg:text-7xl">
                {settings.hero_headline}
                {settings.hero_heading_line2 && (
                  <>
                    <br />
                    <span className="text-black/70">{settings.hero_heading_line2}</span>
                  </>
                )}
              </h1>
              {settings.hero_subheadline && (
                <p className="mt-6 max-w-md text-lg leading-relaxed text-black/70">
                  {settings.hero_subheadline}
                </p>
              )}
              <div className="mt-10 flex items-center gap-4">
                <Link
                  href={settings.hero_cta_url || "/auctions"}
                  className="rounded-full bg-black px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-black/80 hover:shadow-lg"
                >
                  {settings.hero_cta_label || "Enter Auction"}
                </Link>
                {settings.hero_cta2_label && (
                  <Link
                    href={settings.hero_cta2_url || "/minerals"}
                    className="rounded-full border border-black/20 px-8 py-3.5 text-sm font-medium text-black transition-all hover:bg-black/5"
                  >
                    {settings.hero_cta2_label}
                  </Link>
                )}
              </div>
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
