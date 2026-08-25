"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface FavoriteButtonProps {
  lotId: string;
  size?: "sm" | "md";
}

export function FavoriteButton({ lotId, size = "sm" }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkFavorite = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      if (!profile) return;

      const { data } = await supabase
        .from("favorites")
        .select("user_id")
        .eq("user_id", profile.id)
        .eq("lot_id", lotId)
        .maybeSingle();

      setIsFavorite(!!data);
    };

    checkFavorite();
  }, [lotId]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please sign in to add favorites");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_id", user.id)
      .single();

    if (!profile) return;

    setLoading(true);

    if (isFavorite) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", profile.id)
        .eq("lot_id", lotId);

      if (!error) {
        setIsFavorite(false);
        toast.success("Removed from favorites");
      }
    } else {
      const { error } = await supabase
        .from("favorites")
        .insert({ user_id: profile.id, lot_id: lotId });

      if (!error) {
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    }

    setLoading(false);
  };

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const buttonSize = size === "sm" ? "h-8 w-8" : "h-10 w-10";

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`absolute top-3 right-3 ${buttonSize} flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all hover:bg-white hover:scale-110`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        className={`${iconSize} transition-colors ${
          isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
        }`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        fill={isFavorite ? "currentColor" : "none"}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}
