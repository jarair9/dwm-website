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
  hero_heading_line2: string | null;
  hero_subheadline: string | null;
  hero_image: string | null;
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

interface SettingsFormProps {
  settings: Settings | null;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  // Heading
  const [headline, setHeadline] = useState(settings?.hero_headline || "Rare Minerals.");
  const [headlineLine2, setHeadlineLine2] = useState(settings?.hero_heading_line2 || "Exceptional Craft.");
  const [subheadline, setSubheadline] = useState(settings?.hero_subheadline || "");

  // Buttons
  const [ctaLabel, setCtaLabel] = useState(settings?.hero_cta_label || "Enter Auction");
  const [ctaUrl, setCtaUrl] = useState(settings?.hero_cta_url || "/auctions");
  const [cta2Label, setCta2Label] = useState(settings?.hero_cta2_label || "");
  const [cta2Url, setCta2Url] = useState(settings?.hero_cta2_url || "");

  // Stats
  const [stat1Value, setStat1Value] = useState(settings?.hero_stat1_value || "");
  const [stat1Label, setStat1Label] = useState(settings?.hero_stat1_label || "");
  const [stat2Value, setStat2Value] = useState(settings?.hero_stat2_value || "");
  const [stat2Label, setStat2Label] = useState(settings?.hero_stat2_label || "");
  const [stat3Value, setStat3Value] = useState(settings?.hero_stat3_value || "");
  const [stat3Label, setStat3Label] = useState(settings?.hero_stat3_label || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("site_settings").upsert({
      id: 1,
      hero_headline: headline,
      hero_heading_line2: headlineLine2 || null,
      hero_subheadline: subheadline || null,
      hero_cta_label: ctaLabel || null,
      hero_cta_url: ctaUrl || null,
      hero_cta2_label: cta2Label || null,
      hero_cta2_url: cta2Url || null,
      hero_stat1_value: stat1Value || null,
      hero_stat1_label: stat1Label || null,
      hero_stat2_value: stat2Value || null,
      hero_stat2_label: stat2Label || null,
      hero_stat3_value: stat3Value || null,
      hero_stat3_label: stat3Label || null,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      toast.error("Failed to update settings");
    } else {
      toast.success("Hero section updated");
      router.refresh();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Heading */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Heading</h3>
        <div className="space-y-2">
          <Label>Line 1</Label>
          <Input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Rare Minerals."
          />
        </div>
        <div className="space-y-2">
          <Label>Line 2 (optional)</Label>
          <Input
            value={headlineLine2}
            onChange={(e) => setHeadlineLine2(e.target.value)}
            placeholder="Exceptional Craft."
          />
        </div>
        <div className="space-y-2">
          <Label>Subheadline (optional)</Label>
          <Textarea
            value={subheadline}
            onChange={(e) => setSubheadline(e.target.value)}
            rows={2}
            placeholder="Supporting text below heading"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3 border-t border-border pt-4">
        <h3 className="text-sm font-semibold text-foreground">Buttons</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Primary Button Label</Label>
            <Input
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
              placeholder="Enter Auction"
            />
          </div>
          <div className="space-y-2">
            <Label>Primary Button URL</Label>
            <Input
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
              placeholder="/auctions"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Secondary Button Label (optional)</Label>
            <Input
              value={cta2Label}
              onChange={(e) => setCta2Label(e.target.value)}
              placeholder="View Collection"
            />
          </div>
          <div className="space-y-2">
            <Label>Secondary Button URL (optional)</Label>
            <Input
              value={cta2Url}
              onChange={(e) => setCta2Url(e.target.value)}
              placeholder="/minerals"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3 border-t border-border pt-4">
        <h3 className="text-sm font-semibold text-foreground">Stats Bar</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Stat 1 Value</Label>
            <Input
              value={stat1Value}
              onChange={(e) => setStat1Value(e.target.value)}
              placeholder="200+"
            />
          </div>
          <div className="space-y-2">
            <Label>Stat 1 Label</Label>
            <Input
              value={stat1Label}
              onChange={(e) => setStat1Label(e.target.value)}
              placeholder="Specimens Sold"
            />
          </div>
          <div />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Stat 2 Value</Label>
            <Input
              value={stat2Value}
              onChange={(e) => setStat2Value(e.target.value)}
              placeholder="50+"
            />
          </div>
          <div className="space-y-2">
            <Label>Stat 2 Label</Label>
            <Input
              value={stat2Label}
              onChange={(e) => setStat2Label(e.target.value)}
              placeholder="Countries"
            />
          </div>
          <div />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Stat 3 Value</Label>
            <Input
              value={stat3Value}
              onChange={(e) => setStat3Value(e.target.value)}
              placeholder="$2M+"
            />
          </div>
          <div className="space-y-2">
            <Label>Stat 3 Label</Label>
            <Input
              value={stat3Label}
              onChange={(e) => setStat3Label(e.target.value)}
              placeholder="Total Volume"
            />
          </div>
          <div />
        </div>
      </div>

      <Button type="submit" className="rounded-full" disabled={loading}>
        {loading ? "Saving..." : "Save Hero Settings"}
      </Button>
    </form>
  );
}
