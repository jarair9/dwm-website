"use client";

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

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  resolved: boolean;
}

interface MessageActionsProps {
  message: Message;
}

export function MessageActions({ message }: MessageActionsProps) {
  const router = useRouter();
  const supabase = createClient();

  const toggleResolved = async () => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ resolved: !message.resolved })
      .eq("id", message.id);

    if (error) {
      toast.error("Failed to update message");
    } else {
      toast.success(message.resolved ? "Marked as open" : "Marked as resolved");
      router.refresh();
    }
  };

  const replyViaEmail = () => {
    const subject = encodeURIComponent(message.subject || "Re: Your inquiry");
    const body = encodeURIComponent(
      `Hi ${message.name},\n\nThank you for reaching out. `
    );
    window.open(`mailto:${message.email}?subject=${subject}&body=${body}`);
  };

  const sendWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi ${message.name}, thank you for contacting Distinct Mineral World! `
    );
    window.open(`https://wa.me/923109962623?text=${text}`, "_blank");
  };

  const deleteMessage = async () => {
    if (!confirm("Delete this message?")) return;

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", message.id);

    if (error) {
      toast.error("Failed to delete message");
    } else {
      toast.success("Message deleted");
      router.refresh();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="sm">
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={replyViaEmail}>
          Reply via Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={sendWhatsApp}>
          Reply via WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleResolved}>
          {message.resolved ? "Mark as Open" : "Mark as Resolved"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={deleteMessage} className="text-destructive">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
