"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    starting_bid: number;
    images: string[];
    featured: boolean;
    category_id: string | null;
    video_url: string | null;
  };
  categories: { id: string; name: string; type: string }[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.starting_bid || 1);
  const [categoryId, setCategoryId] = useState(product?.category_id || "");
  const [images, setImages] = useState(product?.images?.join("\n") || "");
  const [featured, setFeatured] = useState(product?.featured || false);
  const [videoUrl, setVideoUrl] = useState(product?.video_url || "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from("lot-images")
      .upload(path, file, { contentType: file.type });

    if (error) {
      toast.error("Upload failed: " + error.message);
      return null;
    }

    const { data } = supabase.storage.from("lot-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      const url = await uploadFile(file, "images");
      if (url) newUrls.push(url);
    }

    if (newUrls.length > 0) {
      const current = images.split("\n").filter(Boolean);
      setImages([...current, ...newUrls].join("\n"));
      toast.success(`${newUrls.length} image(s) uploaded`);
    }

    setUploadingImage(false);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    const url = await uploadFile(file, "videos");
    if (url) {
      setVideoUrl(url);
      toast.success("Video uploaded");
    }
    setUploadingVideo(false);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const now = new Date().toISOString();
    const productData = {
      name,
      slug,
      description: description || null,
      starting_bid: price,
      current_bid: price,
      bid_increment: 5,
      start_time: now,
      end_time: now,
      status: "live",
      category_id: categoryId || null,
      images: images.split("\n").map((u) => u.trim()).filter(Boolean),
      featured,
      video_url: videoUrl || null,
    };

    try {
      if (product) {
        const { error } = await supabase
          .from("lots")
          .update(productData)
          .eq("id", product.id);
        if (error) throw error;
        toast.success("Product updated");
      } else {
        const { error } = await supabase.from("lots").insert(productData);
        if (error) throw error;
        toast.success("Product created");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product || !confirm("Delete this product? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from("lots").delete().eq("id", product.id);
      if (error) throw error;
      toast.success("Product deleted");
      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const mineralGemCategories = categories.filter(
    (c) => c.type === "mineral" || c.type === "gemstone"
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!product) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
              }}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>

          {/* Images */}
          <div>
            <label className="text-sm font-medium">Images</label>
            <div className="mt-1 flex gap-2">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploadingImage}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                {uploadingImage ? "Uploading..." : "Upload Images"}
              </button>
            </div>
            <textarea
              value={images}
              onChange={(e) => setImages(e.target.value)}
              placeholder="Or paste image URLs (one per line)"
              rows={3}
              className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
            {images && (
              <div className="mt-2 flex flex-wrap gap-2">
                {images.split("\n").filter(Boolean).map((url, i) => (
                  <div key={i} className="relative h-16 w-16 overflow-hidden rounded-lg border border-border">
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        const urls = images.split("\n").filter(Boolean);
                        urls.splice(i, 1);
                        setImages(urls.join("\n"));
                      }}
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Price ($)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min={1}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
            >
              <option value="">Select category</option>
              {mineralGemCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.type})
                </option>
              ))}
            </select>
          </div>

          {/* Video */}
          <div>
            <label className="text-sm font-medium">Video</label>
            <div className="mt-1 flex gap-2">
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={uploadingVideo}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                {uploadingVideo ? "Uploading..." : "Upload Video"}
              </button>
            </div>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Or paste video URL"
              className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
            {videoUrl && (
              <div className="mt-2 flex items-center gap-2">
                <video src={videoUrl} className="h-20 rounded-lg" controls />
                <button
                  type="button"
                  onClick={() => setVideoUrl("")}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="featured" className="text-sm font-medium">
              Featured on homepage
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-6">
        {product ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete Product"}
          </button>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
          >
            {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
          </button>
        </div>
      </div>
    </form>
  );
}
