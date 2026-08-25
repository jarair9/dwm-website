import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
        Settings
      </h1>
      <p className="mt-2 text-muted-foreground">
        Site configuration and subscriber management
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent>
            <SettingsForm settings={settings} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Newsletter Subscribers ({subscribers?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {subscribers && subscribers.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {subscribers.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{sub.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">
                No subscribers yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
