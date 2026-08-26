import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://distinctmineralworld.com";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/auctions`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/minerals`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/gemstones`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/shipping`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/returns`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  try {
    const supabase = await createClient();
    const { data: lots } = await supabase
      .from("lots")
      .select("slug, updated_at")
      .in("status", ["live", "upcoming", "sold"]);

    const lotPages =
      lots?.map((lot) => ({
        url: `${baseUrl}/auctions/${lot.slug}`,
        lastModified: new Date(lot.updated_at),
        changeFrequency: "daily" as const,
        priority: 0.8,
      })) || [];

    return [...staticPages, ...lotPages];
  } catch {
    return staticPages;
  }
}
