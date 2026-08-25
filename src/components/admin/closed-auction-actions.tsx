"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const statuses = [
  { value: "closed", label: "Closed", color: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
  { value: "awaiting_payment", label: "Awaiting Payment", color: "bg-amber-100 text-amber-700 hover:bg-amber-200" },
  { value: "sold", label: "Sold", color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" },
  { value: "not_sold", label: "Not Sold", color: "bg-red-100 text-red-700 hover:bg-red-200" },
];

interface ClosedAuctionActionsProps {
  lotId: string;
  currentStatus: string;
}

export function ClosedAuctionActions({ lotId, currentStatus }: ClosedAuctionActionsProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setSaving(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("lots")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", lotId);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Status changed to ${newStatus.replace("_", " ")}`);
      router.refresh();
    }
    setSaving(false);
  };

  return (
    <div className="flex items-center gap-2 shrink-0">
      {statuses.map((s) => (
        <button
          key={s.value}
          onClick={() => handleStatusChange(s.value)}
          disabled={saving || currentStatus === s.value}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
            currentStatus === s.value
              ? "ring-2 ring-foreground/20 " + s.color
              : s.color
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
