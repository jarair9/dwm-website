"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { deleteStorageFiles } from "@/lib/storage";

export function DeleteLotButton({
  lotId,
  images,
  videoUrl,
}: {
  lotId: string;
  images?: string[];
  videoUrl?: string | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this lot? This cannot be undone.")) return;
    setDeleting(true);
    try {
      // Clean up storage
      await deleteStorageFiles([...(images ?? []), videoUrl]);

      // Clean up lot_media
      await supabase.from("lot_media").delete().eq("lot_id", lotId);

      const { error } = await supabase.from("lots").delete().eq("id", lotId);
      if (error) throw error;
      toast.success("Lot deleted");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
    >
      {deleting ? "..." : "Delete"}
    </button>
  );
}
