import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminNewsletterPage() {
  const supabase = await createClient();

  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Newsletter Subscribers
          </h1>
          <p className="mt-2 text-muted-foreground">
            People who joined the &ldquo;Join the Next Auction&rdquo; mailing list
          </p>
        </div>
        <Badge variant="secondary">{subscribers?.length || 0} subscribers</Badge>
      </div>

      <div className="mt-8 space-y-4">
        {subscribers && subscribers.length > 0 ? (
          subscribers.map((sub) => (
            <Card key={sub.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                      {sub.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{sub.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Subscribed {new Date(sub.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="rounded-2xl border border-border/50 bg-secondary/30 py-16 text-center">
            <p className="text-muted-foreground">No subscribers yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
