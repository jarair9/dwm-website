"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Banner {
  id: string;
  title: string | null;
  description: string | null;
  image: string;
  cta_label: string | null;
  cta_url: string | null;
  page_type: string;
  sort_order: number;
  dark_image?: string | null;
  dark_title?: string | null;
  dark_description?: string | null;
  dark_cta_label?: string | null;
  dark_cta_url?: string | null;
}

interface BannerActionsProps {
  banner?: Banner;
}

export function BannerActions({ banner }: BannerActionsProps) {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(banner?.title || "");
  const [description, setDescription] = useState(banner?.description || "");
  const [image, setImage] = useState(banner?.image || "");
  const [ctaLabel, setCtaLabel] = useState(banner?.cta_label || "");
  const [ctaUrl, setCtaUrl] = useState(banner?.cta_url || "");
  const [pageType, setPageType] = useState(banner?.page_type || "home");
  const [sortOrder, setSortOrder] = useState(banner?.sort_order || 0);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDark, setShowDark] = useState(false);
  const [darkImage, setDarkImage] = useState(banner?.dark_image || "");
  const [darkTitle, setDarkTitle] = useState(banner?.dark_title || "");
  const [darkDescription, setDarkDescription] = useState(banner?.dark_description || "");
  const [darkCtaLabel, setDarkCtaLabel] = useState(banner?.dark_cta_label || "");
  const [darkCtaUrl, setDarkCtaUrl] = useState(banner?.dark_cta_url || "");
  const [darkUploading, setDarkUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const darkFileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!banner;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isDark = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isDark) setDarkUploading(true);
    else setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `banners/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from("lot-images")
      .upload(path, file, { contentType: file.type });

    if (error) {
      toast.error("Upload failed: " + error.message);
    } else {
      const { data } = supabase.storage.from("lot-images").getPublicUrl(path);
      if (isDark) {
        setDarkImage(data.publicUrl);
      } else {
        setImage(data.publicUrl);
      }
      toast.success("Image uploaded");
    }

    if (isDark) setDarkUploading(false);
    else setUploading(false);

    if (isDark && darkFileInputRef.current) darkFileInputRef.current.value = "";
    if (!isDark && fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      title: title || null,
      description: description || null,
      image,
      cta_label: ctaLabel || null,
      cta_url: ctaUrl || null,
      page_type: pageType,
      sort_order: sortOrder,
      dark_image: darkImage || null,
      dark_title: darkTitle || null,
      dark_description: darkDescription || null,
      dark_cta_label: darkCtaLabel || null,
      dark_cta_url: darkCtaUrl || null,
    };

    let error;
    if (isEditing) {
      const result = await supabase
        .from("banners")
        .update(data)
        .eq("id", banner.id);
      error = result.error;
    } else {
      const result = await supabase.from("banners").insert(data);
      error = result.error;
    }

    if (error) {
      toast.error(`Failed to ${isEditing ? "update" : "create"} banner`);
    } else {
      toast.success(`Banner ${isEditing ? "updated" : "created"} successfully`);
      setOpen(false);
      resetForm();
      router.refresh();
    }

    setLoading(false);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImage("");
    setCtaLabel("");
    setCtaUrl("");
    setPageType("home");
    setSortOrder(0);
    setDarkImage("");
    setDarkTitle("");
    setDarkDescription("");
    setDarkCtaLabel("");
    setDarkCtaUrl("");
    setShowDark(false);
  };

  const handleDelete = async () => {
    if (!banner) return;
    if (!confirm("Delete this banner?")) return;

    const { error } = await supabase.from("banners").delete().eq("id", banner.id);

    if (error) {
      toast.error("Failed to delete banner");
    } else {
      toast.success("Banner deleted");
      router.refresh();
    }
  };

  const ImageUpload = ({
    value,
    onChange,
    uploading: isUploading,
    fileInputRef: ref,
    onUpload,
  }: {
    value: string;
    onChange: (v: string) => void;
    uploading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <div className="flex gap-4">
      {value ? (
        <div className="relative h-32 w-48 overflow-hidden rounded-lg border border-border">
          <Image src={value} alt="Banner preview" fill className="object-cover" sizes="192px" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-black/80"
          >
            x
          </button>
        </div>
      ) : (
        <div className="flex h-32 w-48 items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/30">
          <p className="text-xs text-muted-foreground">No image</p>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <input ref={ref} type="file" accept="image/*" onChange={onUpload} className="hidden" />
        <button
          type="button"
          onClick={() => ref?.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          {isUploading ? "Uploading..." : "Upload Image"}
        </button>
        <p className="text-[10px] text-muted-foreground">Or paste URL below</p>
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://example.com/banner.jpg" className="text-xs" />
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {isEditing ? (
          <span className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer">
            Edit
          </span>
        ) : (
          <span className="inline-flex items-center justify-center rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background hover:bg-foreground/90 cursor-pointer">
            + Add Banner
          </span>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Banner" : "New Banner"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Light Theme */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-white border border-gray-300" />
              <h3 className="text-sm font-semibold text-foreground">Light Theme</h3>
            </div>
            <div className="space-y-2">
              <Label>Banner Image *</Label>
              <ImageUpload
                value={image}
                onChange={setImage}
                uploading={uploading}
                fileInputRef={fileInputRef}
                onUpload={(e) => handleImageUpload(e, false)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title (optional)</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Summer Collection" />
              </div>
              <div className="space-y-2">
                <Label>Page Type</Label>
                <Select value={pageType} onValueChange={(v) => v && setPageType(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="mineral">Mineral</SelectItem>
                    <SelectItem value="gemstone">Gemstone</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Banner description text..." />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>CTA Label (optional)</Label>
                <Input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} placeholder="Shop Now" />
              </div>
              <div className="space-y-2">
                <Label>CTA URL (optional)</Label>
                <Input value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="/auctions" />
              </div>
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} min={0} />
              </div>
            </div>
          </div>

          {/* Dark Theme Toggle */}
          <div className="border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setShowDark(!showDark)}
              className="flex items-center gap-2 text-sm font-semibold text-foreground hover:opacity-80"
            >
              <div className="h-6 w-6 rounded-full bg-gray-900 border border-gray-700" />
              Dark Theme Banner
              <svg className={`h-4 w-4 transition-transform ${showDark ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDark && (
              <div className="mt-4 space-y-4 rounded-xl border border-border bg-secondary/30 p-4">
                <div className="space-y-2">
                  <Label>Dark Theme Image (optional — uses light image if empty)</Label>
                  <ImageUpload
                    value={darkImage}
                    onChange={setDarkImage}
                    uploading={darkUploading}
                    fileInputRef={darkFileInputRef}
                    onUpload={(e) => handleImageUpload(e, true)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Dark Title (optional)</Label>
                    <Input value={darkTitle} onChange={(e) => setDarkTitle(e.target.value)} placeholder="Overrides light title" />
                  </div>
                  <div className="space-y-2">
                    <Label>Dark CTA Label (optional)</Label>
                    <Input value={darkCtaLabel} onChange={(e) => setDarkCtaLabel(e.target.value)} placeholder="Overrides light CTA" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Dark Description (optional)</Label>
                  <Textarea value={darkDescription} onChange={(e) => setDarkDescription(e.target.value)} rows={2} placeholder="Overrides light description" />
                </div>
                <div className="space-y-2">
                  <Label>Dark CTA URL (optional)</Label>
                  <Input value={darkCtaUrl} onChange={(e) => setDarkCtaUrl(e.target.value)} placeholder="/auctions" />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-2 border-t border-border">
            <Button type="submit" className="rounded-full" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Update Banner" : "Create Banner"}
            </Button>
            {isEditing && (
              <Button type="button" variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
