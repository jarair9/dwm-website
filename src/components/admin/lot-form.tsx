"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { deleteStorageFiles } from "@/lib/storage";
import {
  validateImageFile,
  validateVideoFile,
} from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Lot {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  starting_bid: number;
  bid_increment: number;
  start_time: string;
  end_time: string;
  status: string;
  category_id: string | null;
  images: string[];
  featured: boolean;
  video_url: string | null;
}

interface LotFormProps {
  lot?: Lot;
  categories: Category[];
}

export function LotForm({ lot, categories }: LotFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEditing = !!lot;
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(lot?.name || "");
  const [slug, setSlug] = useState(lot?.slug || "");
  const [description, setDescription] = useState(lot?.description || "");
  const [startingBid, setStartingBid] = useState(lot?.starting_bid || 100);
  const [bidIncrement, setBidIncrement] = useState(lot?.bid_increment || 10);
  const [startTime, setStartTime] = useState(
    lot?.start_time ? new Date(lot.start_time).toISOString().slice(0, 16) : ""
  );
  const [endTime, setEndTime] = useState(
    lot?.end_time ? new Date(lot.end_time).toISOString().slice(0, 16) : ""
  );
  const [status, setStatus] = useState(lot?.status || "draft");
  const [categoryId, setCategoryId] = useState(lot?.category_id || "");
  const [images, setImages] = useState(lot?.images?.join("\n") || "");
  const [featured, setFeatured] = useState(lot?.featured || false);
  const [videoUrl, setVideoUrl] = useState(lot?.video_url || "");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!isEditing) {
      setSlug(generateSlug(value));
    }
  };

  const uploadFile = async (
    file: File,
    folder: string
  ): Promise<string | null> => {
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
      const validationError = validateImageFile(file);
      if (validationError) {
        toast.error(validationError);
        continue;
      }
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

    const validationError = validateVideoFile(file);
    if (validationError) {
      toast.error(validationError);
      if (videoInputRef.current) videoInputRef.current.value = "";
      return;
    }

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

    const imageUrls = images
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const lotData = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      starting_bid: startingBid,
      bid_increment: bidIncrement,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      status,
      category_id: categoryId || null,
      images: imageUrls,
      featured,
      video_url: videoUrl || null,
    };

    let error;
    if (isEditing) {
      const result = await supabase
        .from("lots")
        .update(lotData)
        .eq("id", lot!.id);
      error = result.error;
    } else {
      const result = await supabase.from("lots").insert(lotData);
      error = result.error;
    }

    if (error) {
      toast.error(`Failed to ${isEditing ? "update" : "create"} lot`);
    } else {
      toast.success(`Lot ${isEditing ? "updated" : "created"} successfully`);
      router.push("/admin/lots");
      router.refresh();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Kashmir Blue Sapphire"
              required
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="kashmir-blue-sapphire"
              required
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the specimen..."
              rows={4}
              maxLength={5000}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={categoryId}
              onValueChange={(v) => setCategoryId(v || "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>Images</Label>
            <div className="flex gap-2">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
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
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                {uploadingImage ? "Uploading..." : "Upload Images"}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              JPEG, PNG, WebP, AVIF — max 10MB each
            </p>
            <Textarea
              value={images}
              onChange={(e) => setImages(e.target.value)}
              placeholder="Or paste image URLs (one per line)"
              rows={3}
              className="mt-2"
            />
            {images && (
              <div className="mt-2 flex flex-wrap gap-2">
                {images.split("\n").filter(Boolean).map((url, i) => (
                  <div
                    key={i}
                    className="relative h-16 w-16 overflow-hidden rounded-lg border border-border"
                  >
                    <img
                      src={url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const urls = images.split("\n").filter(Boolean);
                        urls.splice(i, 1);
                        setImages(urls.join("\n"));
                      }}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startingBid">Starting Bid ($)</Label>
              <Input
                id="startingBid"
                type="number"
                value={startingBid}
                onChange={(e) => setStartingBid(Number(e.target.value))}
                min={1}
                max={10000000}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bidIncrement">Bid Increment ($)</Label>
              <Input
                id="bidIncrement"
                type="number"
                value={bidIncrement}
                onChange={(e) => setBidIncrement(Number(e.target.value))}
                min={5}
                max={1000000}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(v) => v && setStatus(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="not_sold">Not Sold</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Video */}
          <div className="space-y-2">
            <Label>Video</Label>
            <div className="flex gap-2">
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleVideoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={uploadingVideo}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-50"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                {uploadingVideo ? "Uploading..." : "Upload Video"}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              MP4, WebM — max 100MB
            </p>
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Or paste video URL (YouTube, Vimeo, etc.)"
              className="mt-2"
              maxLength={500}
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
            <Label htmlFor="featured">Featured on homepage</Label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-6">
        {isEditing && (
          <button
            type="button"
            onClick={async () => {
              if (!lot || !confirm("Delete this lot? This cannot be undone."))
                return;
              setLoading(true);
              try {
                // Clean up storage
                await deleteStorageFiles([...(lot.images ?? []), lot.video_url]);
                // Clean up lot_media
                await supabase.from("lot_media").delete().eq("lot_id", lot.id);

                const { error } = await supabase
                  .from("lots")
                  .delete()
                  .eq("id", lot.id);
                if (error) throw error;
                toast.success("Lot deleted");
                router.push("/admin/lots");
                router.refresh();
              } catch (err: unknown) {
                toast.error(
                  err instanceof Error ? err.message : "Failed to delete"
                );
              } finally {
                setLoading(false);
              }
            }}
            className="rounded-full border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
            disabled={loading}
          >
            Delete
          </button>
        )}
        <div className="flex gap-4">
          <Button type="submit" className="rounded-full" disabled={loading}>
            {loading
              ? "Saving..."
              : isEditing
                ? "Update Lot"
                : "Create Lot"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
