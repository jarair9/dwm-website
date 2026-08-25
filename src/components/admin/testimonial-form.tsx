"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface TestimonialFormProps {
  testimonial?: {
    id: string;
    author: string;
    location: string | null;
    content: string;
    rating: number;
    author_photo_url: string | null;
  };
  onDone: () => void;
}

export function TestimonialForm({ testimonial, onDone }: TestimonialFormProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const [author, setAuthor] = useState(testimonial?.author || "");
  const [location, setLocation] = useState(testimonial?.location || "");
  const [content, setContent] = useState(testimonial?.content || "");
  const [rating, setRating] = useState(testimonial?.rating || 5);
  const [photoUrl, setPhotoUrl] = useState(testimonial?.author_photo_url || "");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `testimonials/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from("lot-images")
      .upload(path, file, { contentType: file.type });

    if (error) {
      toast.error("Upload failed: " + error.message);
    } else {
      const { data } = supabase.storage.from("lot-images").getPublicUrl(path);
      setPhotoUrl(data.publicUrl);
      toast.success("Image uploaded");
    }
    setUploading(false);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      author,
      location: location || null,
      content,
      rating,
      author_photo_url: photoUrl || null,
    };

    try {
      if (testimonial) {
        const { error } = await supabase
          .from("testimonials")
          .update(data)
          .eq("id", testimonial.id);
        if (error) throw error;
        toast.success("Testimonial updated");
      } else {
        const { error } = await supabase.from("testimonials").insert(data);
        if (error) throw error;
        toast.success("Testimonial added");
      }
      onDone();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!testimonial || !confirm("Delete this testimonial?")) return;
    setDeleting(true);
    const { error } = await supabase.from("testimonials").delete().eq("id", testimonial.id);
    if (!error) {
      toast.success("Testimonial deleted");
      onDone();
    } else {
      toast.error("Failed to delete");
    }
    setDeleting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Photo */}
      <div>
        <label className="text-sm font-medium">Customer Photo</label>
        <div className="mt-2 flex items-center gap-4">
          {photoUrl ? (
            <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border">
              <img src={photoUrl} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setPhotoUrl("")}
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
              >
                x
              </button>
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-lg font-medium text-muted-foreground">
              {author ? author[0].toUpperCase() : "?"}
            </div>
          )}
          <div>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              {uploading ? "Uploading..." : "Upload Photo"}
            </button>
          </div>
        </div>
      </div>

      {/* Author */}
      <div>
        <label className="text-sm font-medium">Customer Name *</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm"
          required
        />
      </div>

      {/* Location */}
      <div>
        <label className="text-sm font-medium">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, Country"
          className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm"
        />
      </div>

      {/* Rating */}
      <div>
        <label className="text-sm font-medium">Rating</label>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <svg
                className={`h-7 w-7 transition-colors ${
                  star <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200 hover:text-amber-200"
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">({rating}/5)</span>
        </div>
      </div>

      {/* Content */}
      <div>
        <label className="text-sm font-medium">Review *</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm"
          required
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-border pt-5">
        {testimonial ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onDone}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
          >
            {loading ? "Saving..." : testimonial ? "Update" : "Add Testimonial"}
          </button>
        </div>
      </div>
    </form>
  );
}
