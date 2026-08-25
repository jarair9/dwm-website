"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Settings {
  id: number;
  hero_headline: string;
  hero_subheadline: string | null;
  hero_image: string | null;
  hero_cta_label: string | null;
  hero_cta_url: string | null;
}

interface SettingsFormProps {
  settings: Settings | null;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [headline, setHeadline] = useState(
    settings?.hero_headline || "Rare minerals and gemstones, auctioned with care."
  );
  const [subheadline, setSubheadline] = useState(
    settings?.hero_subheadline || ""
  );
  const [heroImage, setHeroImage] = useState(settings?.hero_image || "");
  const [ctaLabel, setCtaLabel] = useState(settings?.hero_cta_label || "Browse live auctions");
  const [ctaUrl, setCtaUrl] = useState(settings?.hero_cta_url || "/auctions?status=live");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("site_settings").upsert({
      id: 1,
      hero_headline: headline,
      hero_subheadline: subheadline || null,
      hero_image: heroImage || null,
      hero_cta_label: ctaLabel || null,
      hero_cta_url: ctaUrl || null,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      toast.error("Failed to update settings");
    } else {
      toast.success("Settings updated");
      router.refresh();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Headline</Label>
        <Input
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="Your headline"
        />
      </div>
      <div className="space-y-2">
        <Label>Subheadline</Label>
        <Textarea
          value={subheadline}
          onChange={(e) => setSubheadline(e.target.value)}
          rows={2}
          placeholder="Supporting text"
        />
      </div>
      <div className="space-y-2">
        <Label>Hero Image URL</Label>
        <Input
          value={heroImage}
          onChange={(e) => setHeroImage(e.target.value)}
          placeholder="https://example.com/hero.jpg"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>CTA Label</Label>
          <Input
            value={ctaLabel}
            onChange={(e) => setCtaLabel(e.target.value)}
            placeholder="Browse auctions"
          />
        </div>
        <div className="space-y-2">
          <Label>CTA URL</Label>
          <Input
            value={ctaUrl}
            onChange={(e) => setCtaUrl(e.target.value)}
            placeholder="/auctions"
          />
        </div>
      </div>
      <Button type="submit" className="rounded-full" disabled={loading}>
        {loading ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
}
