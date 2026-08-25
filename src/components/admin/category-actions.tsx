"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
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

interface Category {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
}

interface CategoryActionsProps {
  category?: Category;
  parentCategories?: { id: string; name: string; type: string }[];
}

export function CategoryActions({ category, parentCategories = [] }: CategoryActionsProps) {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || "");
  const [type, setType] = useState(category?.type || "gemstone");
  const [description, setDescription] = useState(category?.description || "");
  const [imageUrl, setImageUrl] = useState(category?.image_url || "");
  const [parentId, setParentId] = useState(category?.parent_id || "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!category;

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `categories/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from("lot-images")
      .upload(path, file, { contentType: file.type });

    if (error) {
      toast.error("Upload failed: " + error.message);
    } else {
      const { data } = supabase.storage.from("lot-images").getPublicUrl(path);
      setImageUrl(data.publicUrl);
      toast.success("Image uploaded");
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      name,
      slug: slug || generateSlug(name),
      type,
      description: description || null,
      image_url: imageUrl || null,
      parent_id: parentId || null,
    };

    let error;
    if (isEditing) {
      const result = await supabase
        .from("categories")
        .update(data)
        .eq("id", category.id);
      error = result.error;
    } else {
      const result = await supabase.from("categories").insert(data);
      error = result.error;
    }

    if (error) {
      toast.error(`Failed to ${isEditing ? "update" : "create"} category`);
    } else {
      toast.success(
        `Category ${isEditing ? "updated" : "created"} successfully`
      );
      setOpen(false);
      setName("");
      setSlug("");
      setType("gemstone");
      setDescription("");
      setImageUrl("");
      setParentId("");
      router.refresh();
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    if (!category) return;
    if (!confirm("Delete this category? Lots and subcategories will be unassigned.")) return;

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", category.id);

    if (error) {
      toast.error("Failed to delete category");
    } else {
      toast.success("Category deleted");
      router.refresh();
    }
  };

  const filteredParents = parentCategories.filter(
    (p) => p.id !== category?.id
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
            Add Category
          </span>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Category" : "New Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!isEditing) setSlug(generateSlug(e.target.value));
              }}
              placeholder="Sapphires"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="sapphires"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => v && setType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemstone">Gemstone</SelectItem>
                <SelectItem value="mineral">Mineral</SelectItem>
                <SelectItem value="fossil">Fossil</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Parent Category */}
          {filteredParents.length > 0 && (
            <div className="space-y-2">
              <Label>Parent Category (optional)</Label>
              <Select value={parentId} onValueChange={(v) => setParentId(v || "")}>
                <SelectTrigger>
                  <SelectValue placeholder="None (top-level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None (top-level)</SelectItem>
                  {filteredParents.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name} ({cat.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Leave empty for top-level category
              </p>
            </div>
          )}

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Category Image</Label>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                {uploading ? "Uploading..." : "Upload Image"}
              </button>
            </div>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Or paste image URL"
              className="mt-2"
            />
            {imageUrl && (
              <div className="mt-2 relative inline-block">
                <img src={imageUrl} alt="" className="h-20 w-20 rounded-lg object-cover border border-border" />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
                >
                  x
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex gap-4">
            <Button type="submit" className="rounded-full" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
