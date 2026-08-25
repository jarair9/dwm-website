"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Invoice {
  id: string;
  amount: number;
  status: string;
  buyer_id: string | null;
  lot_id: string | null;
}

interface InvoiceActionsProps {
  invoice: Invoice;
}

export function InvoiceActions({ invoice }: InvoiceActionsProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status: string) => {
    setLoading(true);
    const { error } = await supabase
      .from("invoices")
      .update({ status })
      .eq("id", invoice.id);

    if (error) {
      toast.error("Failed to update invoice");
    } else {
      toast.success(`Invoice marked as ${status}`);
      router.refresh();
    }
    setLoading(false);
  };

  const sendWhatsApp = async () => {
    const { data: lot } = await supabase
      .from("lots")
      .select("name")
      .eq("id", invoice.lot_id || "")
      .single();

    const message = encodeURIComponent(
      `Hello! Your invoice for "${lot?.name || "an item"}" is ready. Amount: $${invoice.amount.toLocaleString()}. Please complete payment to confirm your purchase.`
    );
    window.open(`https://wa.me/923109962623?text=${message}`, "_blank");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="sm" disabled={loading}>
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {invoice.status !== "paid" && (
          <DropdownMenuItem onClick={() => updateStatus("paid")}>
            Mark as Paid
          </DropdownMenuItem>
        )}
        {invoice.status !== "overdue" && invoice.status !== "paid" && (
          <DropdownMenuItem onClick={() => updateStatus("overdue")}>
            Mark as Overdue
          </DropdownMenuItem>
        )}
        {invoice.status !== "cancelled" && (
          <DropdownMenuItem onClick={() => updateStatus("cancelled")}>
            Cancel Invoice
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={sendWhatsApp}>
          Send via WhatsApp
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
