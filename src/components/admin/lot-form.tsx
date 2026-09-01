"use client";

import { useState, useRef, useMemo } from "react";
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
  current_bid: number | null;
}

interface LotFormProps {
  lot?: Lot;
  categories: Category[];
}

const VALID_TRANSITIONS: Record<string, string[]> = {
  draft: ["upcoming", "live", "withdrawn"],
  upcoming: ["live", "draft", "withdrawn"],
  live: ["closed", "sold", "not_sold", "withdrawn"],
  closed: ["live", "upcoming", "sold", "not_sold", "withdrawn"],
  sold: ["closed"],
  not_sold: ["live", "upcoming", "closed", "withdrawn"],
  withdrawn: ["draft", "upcoming"],
};

function toLocalDatetime(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function addHours(localDatetime: string, hours: number): string {
  const d = new Date(localDatetime);
  d.setHours(d.getHours() + hours);
  return toLocalDatetime(d.toISOString());
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
  const [startTime, setStartTime] = useState(toLocalDatetime(lot?.start_time));
  const [endTime, setEndTime] = useState(toLocalDatetime(lot?.end_time));
  const [status, setStatus] = useState(lot?.status || "draft");
  const [categoryId, setCategoryId] = useState(lot?.category_id || "");
  const [images, setImages] = useState(lot?.images?.join("\n") || "");
  const [featured, setFeatured] = useState(lot?.featured || false);
  const [videoUrl, setVideoUrl] = useState(lot?.video_url || "");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const now = useMemo(() => new Date(), []);
  const originalStatus = lot?.status || "draft";
  const isStatusChanged = status !== originalStatus;
  const allowedTransitions = VALID_TRANSITIONS[originalStatus] || [];
  const isTransitionValid = !isStatusChanged || allowedTransitions.includes(status);

  const imageCount = images.split("\n").filter((u) => u.trim()).length;

  const timeWarnings = useMemo(() => {
    const warnings: string[] = [];
    if (status === "live") {
      if (endTime && new Date(endTime) <= now) {
        warnings.push("End time is in the past — auction will close immediately if set to Live.");
      }
      if (startTime && new Date(startTime) > now) {
        warnings.push("Start time is in the future — auction won't be visible until then.");
      }
    }
    if (status === "upcoming") {
      if (startTime && new Date(startTime) <= now) {
        warnings.push("Start time is in the past — lot will appear as 'upcoming' but may confuse bidders.");
      }
      if (endTime && new Date(endTime) <= now) {
        warnings.push("End time is in the past.");
      }
    }
    return warnings;
  }, [status, startTime, endTime, now]);

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

  const handleStatusChange = (newStatus: string) => {
    if (!VALID_TRANSITIONS[originalStatus]?.includes(newStatus)) {
      toast.error(`Cannot change from "${originalStatus}" to "${newStatus}"`);
      return;
    }

    setStatus(newStatus);

    if (newStatus === "live" && endTime && new Date(endTime) <= now) {
      const suggested = addHours(toLocalDatetime(now.toISOString()), 72);
      setEndTime(suggested);
      toast.info("End time was in the past — auto-set to 72 hours from now. Adjust as needed.");
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

    if (!isTransitionValid) {
      toast.error(`Invalid status transition from "${originalStatus}" to "${status}"`);
      setLoading(false);
      return;
    }

    if (startTime && endTime && new Date(endTime) <= new Date(startTime)) {
      toast.error("End time must be after start time");
      setLoading(false);
      return;
    }

    if (status === "live" && endTime && new Date(endTime) <= now) {
      toast.error("Cannot set status to Live with an end time in the past. Update the end time first.");
      setLoading(false);
      return;
    }

    if (status === "upcoming" && startTime && new Date(startTime) <= now) {
      toast.warning("Start time is in the past — lot will immediately become 'live' on next auto-close check. Consider setting start time to the future.");
    }

    if (status === "live" && imageCount === 0) {
      toast.error("A live auction must have at least one image");
      setLoading(false);
      return;
    }

    if (startingBid < 1) {
      toast.error("Starting bid must be at least $1");
      setLoading(false);
      return;
    }

    if (bidIncrement < 1) {
      toast.error("Bid increment must be at least $1");
      setLoading(false);
      return;
    }

    if (bidIncrement >= startingBid) {
      toast.error("Bid increment must be less than starting bid");
      setLoading(false);
      return;
    }

    setLoading(true);

    const imageUrls = images
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const isReopening = isEditing && ["closed", "sold", "not_sold", "withdrawn"].includes(originalStatus) && ["live", "upcoming"].includes(status);

    const lotData: Record<string, unknown> = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      starting_bid: startingBid,
      bid_increment: bidIncrement,
      start_time: startTime ? new Date(startTime).toISOString() : null,
      end_time: endTime ? new Date(endTime).toISOString() : null,
      status,
      type: "lot",
      category_id: categoryId || null,
      images: imageUrls,
      featured,
      video_url: videoUrl || null,
    };

    if (isReopening) {
      lotData.current_bid = null;
    }

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
      toast.error(`Failed to ${isEditing ? "update" : "create"} lot: ${error.message}`);
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

          <div className="space-y-2">
            <Label>Images {status === "live" && <span className="text-red-500">*</span>}</Label>
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
              JPEG, PNG, WebP, AVIF — max 10MB each. {imageCount > 0 && <span className="font-medium">{imageCount} image(s) added</span>}
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
              {startingBid < 1 && (
                <p className="text-xs text-red-500">Must be at least $1</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bidIncrement">Bid Increment ($)</Label>
              <Input
                id="bidIncrement"
                type="number"
                value={bidIncrement}
                onChange={(e) => setBidIncrement(Number(e.target.value))}
                min={1}
                max={1000000}
                required
              />
              {bidIncrement >= startingBid && startingBid > 0 && (
                <p className="text-xs text-red-500">Must be less than starting bid</p>
              )}
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
            {startTime && new Date(startTime) <= now && status === "upcoming" && (
              <p className="text-xs text-amber-600">Start time is in the past — lot will appear as &quot;upcoming&quot; but may confuse bidders</p>
            )}
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
            {endTime && new Date(endTime) <= now && status === "live" && (
              <p className="text-xs text-red-500">End time is in the past — must update before setting status to Live</p>
            )}
          </div>

          {timeWarnings.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              {timeWarnings.map((w, i) => (
                <p key={i} className="text-xs text-amber-700">{w}</p>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(v) => v && handleStatusChange(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft" disabled={!VALID_TRANSITIONS[originalStatus]?.includes("draft")}>
                  Draft
                </SelectItem>
                <SelectItem value="upcoming" disabled={!VALID_TRANSITIONS[originalStatus]?.includes("upcoming")}>
                  Upcoming
                </SelectItem>
                <SelectItem value="live" disabled={!VALID_TRANSITIONS[originalStatus]?.includes("live")}>
                  Live
                </SelectItem>
                <SelectItem value="closed" disabled={!VALID_TRANSITIONS[originalStatus]?.includes("closed")}>
                  Closed
                </SelectItem>
                <SelectItem value="sold" disabled={!VALID_TRANSITIONS[originalStatus]?.includes("sold")}>
                  Sold
                </SelectItem>
                <SelectItem value="not_sold" disabled={!VALID_TRANSITIONS[originalStatus]?.includes("not_sold")}>
                  Not Sold
                </SelectItem>
                <SelectItem value="withdrawn" disabled={!VALID_TRANSITIONS[originalStatus]?.includes("withdrawn")}>
                  Withdrawn
                </SelectItem>
              </SelectContent>
            </Select>
            {!isTransitionValid && (
              <p className="text-xs text-red-500">
                Cannot transition from &quot;{originalStatus}&quot; to &quot;{status}&quot;
              </p>
            )}
            {isEditing && isStatusChanged && (
              <p className="text-xs text-muted-foreground">
                Current: {originalStatus} → New: {status}
              </p>
            )}
          </div>

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
                await deleteStorageFiles([...(lot.images ?? []), lot.video_url]);
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
          <Button type="submit" className="rounded-full" disabled={loading || !isTransitionValid}>
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
