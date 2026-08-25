"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { TestimonialForm } from "@/components/admin/testimonial-form";

interface Testimonial {
  id: string;
  author: string;
  location: string | null;
  content: string;
  rating: number;
  author_photo_url: string | null;
  created_at: string;
}

export default function AdminTestimonialsPage() {
  const supabase = createClient();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });
    setTestimonials(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDone = () => {
    setShowForm(false);
    setEditing(null);
    fetchTestimonials();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Testimonials</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage customer reviews and ratings
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditing(null); }}
            className="rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            + Add Testimonial
          </button>
        )}
      </div>

      {showForm && (
        <div className="mt-8 rounded-2xl border border-border/50 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            {editing ? "Edit Testimonial" : "New Testimonial"}
          </h2>
          <TestimonialForm testimonial={editing || undefined} onDone={handleDone} />
        </div>
      )}

      <div className="mt-8 space-y-4">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-border/50 bg-white p-6">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-full bg-secondary" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-secondary" />
                  <div className="h-3 w-48 rounded bg-secondary" />
                  <div className="h-16 rounded bg-secondary" />
                </div>
              </div>
            </div>
          ))
        ) : testimonials.length === 0 ? (
          <div className="rounded-2xl border border-border/50 bg-white py-16 text-center">
            <p className="text-muted-foreground">No testimonials yet</p>
          </div>
        ) : (
          testimonials.map((t) => (
            <div
              key={t.id}
              className="flex items-start gap-4 rounded-2xl border border-border/50 bg-white p-6 transition-all hover:shadow-md"
            >
              {/* Avatar */}
              {t.author_photo_url ? (
                <img
                  src={t.author_photo_url}
                  alt={t.author}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
                  {t.author[0].toUpperCase()}
                </div>
              )}

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{t.author}</p>
                    {t.location && (
                      <p className="text-xs text-muted-foreground">{t.location}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${i < t.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditing(t); setShowForm(true); }}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (!confirm("Delete this testimonial?")) return;
                    await supabase.from("testimonials").delete().eq("id", t.id);
                    fetchTestimonials();
                  }}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
