import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BannerActions } from "@/components/admin/banner-actions";

export default async function AdminBannersPage() {
  const supabase = await createClient();

  const { data: banners } = await supabase
    .from("banners")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Banners
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage homepage and category banners
          </p>
        </div>
        <BannerActions />
      </div>

      <div className="mt-8 space-y-4">
        {banners && banners.length > 0 ? (
          banners.map((banner) => (
            <Card key={banner.id}>
              <CardContent className="flex items-center gap-6 p-4">
                <img
                  src={banner.image}
                  alt={banner.title || "Banner"}
                  className="h-20 w-40 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{banner.title || "Untitled"}</h3>
                    <Badge variant="outline" className="capitalize">
                      {banner.page_type}
                    </Badge>
                    {banner.sort_order > 0 && (
                      <Badge variant="secondary">Order: {banner.sort_order}</Badge>
                    )}
                  </div>
                  {banner.description && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                      {banner.description}
                    </p>
                  )}
                  <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                    {banner.cta_label && <span>CTA: {banner.cta_label}</span>}
                    {banner.cta_url && <span>URL: {banner.cta_url}</span>}
                  </div>
                </div>
                <BannerActions banner={banner} />
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="rounded-2xl border border-border/50 bg-secondary/30 py-16 text-center">
            <p className="text-muted-foreground">No banners yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
