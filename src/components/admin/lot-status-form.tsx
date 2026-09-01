"use client";

import React from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const VALID_TRANSITIONS: Record<string, string[]> = {
  draft: ["upcoming", "live", "withdrawn"],
  upcoming: ["live", "draft", "withdrawn"],
  live: ["closed", "sold", "not_sold", "withdrawn"],
  closed: ["live", "upcoming", "sold", "not_sold", "withdrawn"],
  sold: ["closed"],
  not_sold: ["live", "upcoming", "closed", "withdrawn"],
  withdrawn: ["draft", "upcoming"],
};

interface LotStatusFormProps {
  lotId: string;
  currentStatus: string;
  endTime?: string;
}

export function LotStatusForm({ lotId, currentStatus, endTime }: LotStatusFormProps) {
  const [status, setStatus] = React.useState(currentStatus);
  const [saving, setSaving] = React.useState(false);
  const supabase = createClient();

  const allowedTransitions = VALID_TRANSITIONS[currentStatus] || [];
  const isTransitionValid = status === currentStatus || allowedTransitions.includes(status);

  const handleUpdate = async () => {
    if (!isTransitionValid) {
      toast.error(`Cannot change from "${currentStatus}" to "${status}"`);
      return;
    }

    if (status === "live" && endTime && new Date(endTime) <= new Date()) {
      toast.error("Cannot set to Live — end time is in the past. Edit the lot to update the end time first.");
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("lots").update({ status }).eq("id", lotId);
    setSaving(false);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Status changed to ${status}`);
      window.location.reload();
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <select
        value={status}
        onChange={(e) => {
          const newStatus = e.target.value;
          if (!VALID_TRANSITIONS[currentStatus]?.includes(newStatus) && newStatus !== currentStatus) {
            toast.error(`Cannot change from "${currentStatus}" to "${newStatus}"`);
            return;
          }
          setStatus(newStatus);
        }}
        className="rounded border border-border px-2 py-1 text-xs"
      >
        <option value="draft" disabled={!allowedTransitions.includes("draft") && currentStatus !== "draft"}>
          Draft
        </option>
        <option value="upcoming" disabled={!allowedTransitions.includes("upcoming") && currentStatus !== "upcoming"}>
          Upcoming
        </option>
        <option value="live" disabled={!allowedTransitions.includes("live") && currentStatus !== "live"}>
          Live
        </option>
        <option value="closed" disabled={!allowedTransitions.includes("closed") && currentStatus !== "closed"}>
          Closed
        </option>
        <option value="sold" disabled={!allowedTransitions.includes("sold") && currentStatus !== "sold"}>
          Sold
        </option>
        <option value="not_sold" disabled={!allowedTransitions.includes("not_sold") && currentStatus !== "not_sold"}>
          Not Sold
        </option>
        <option value="withdrawn" disabled={!allowedTransitions.includes("withdrawn") && currentStatus !== "withdrawn"}>
          Withdrawn
        </option>
      </select>
      <button
        onClick={handleUpdate}
        disabled={saving || status === currentStatus || !isTransitionValid}
        className="rounded bg-foreground px-2 py-1 text-xs font-medium text-background hover:bg-foreground/90 disabled:opacity-50"
      >
        {saving ? "..." : "Update"}
      </button>
    </div>
  );
}
