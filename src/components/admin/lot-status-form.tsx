"use client";

import React from "react";
import { createClient } from "@/lib/supabase/client";

export function LotStatusForm({ lotId, currentStatus }: { lotId: string; currentStatus: string }) {
  const [status, setStatus] = React.useState(currentStatus);
  const [saving, setSaving] = React.useState(false);
  const supabase = createClient();

  const handleUpdate = async () => {
    setSaving(true);
    await supabase.from("lots").update({ status }).eq("id", lotId);
    setSaving(false);
    window.location.reload();
  };

  return (
    <div className="flex gap-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded border border-border px-2 py-1 text-xs"
      >
        <option value="draft">Draft</option>
        <option value="upcoming">Upcoming</option>
        <option value="live">Live</option>
        <option value="closed">Closed</option>
        <option value="sold">Sold</option>
        <option value="not_sold">Not Sold</option>
      </select>
      <button
        onClick={handleUpdate}
        disabled={saving || status === currentStatus}
        className="rounded bg-foreground px-2 py-1 text-xs font-medium text-background hover:bg-foreground/90 disabled:opacity-50"
      >
        {saving ? "..." : "Update"}
      </button>
    </div>
  );
}
