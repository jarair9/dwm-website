import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageActions } from "@/components/admin/message-actions";

export default async function AdminMessagesPage() {
  const supabase = await createClient();

  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Messages
          </h1>
          <p className="mt-2 text-muted-foreground">
            Contact form submissions
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {messages && messages.length > 0 ? (
          messages.map((message) => (
            <Card
              key={message.id}
              className={message.resolved ? "opacity-60" : ""}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{message.name}</h3>
                      <Badge
                        variant={message.resolved ? "secondary" : "default"}
                      >
                        {message.resolved ? "Resolved" : "Open"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {message.email}
                    </p>
                    {message.subject && (
                      <p className="mt-2 text-sm font-medium">
                        {message.subject}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-muted-foreground">
                      {message.message}
                    </p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>
                  <MessageActions message={message} />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="rounded-2xl border border-border/50 bg-secondary/30 py-16 text-center">
            <p className="text-muted-foreground">No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
