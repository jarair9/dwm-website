"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileId, setProfileId] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("auth_id", user.id)
        .single();

      if (profile) {
        setProfileId(profile.id);
        setFullName(profile.full_name || "");
        setEmail(profile.email || user.email || "");
        setPhone(profile.phone || "");
        setWhatsapp(profile.whatsapp || "");
      }
      setLoading(false);
    };

    getProfile();
  }, [supabase, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        email,
        phone: phone || null,
        whatsapp: whatsapp || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profileId);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 bg-background">
          <div className="mx-auto max-w-2xl px-6 py-16 pt-24 lg:pt-20">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-48 rounded bg-secondary" />
              <div className="h-4 w-32 rounded bg-secondary" />
              <div className="mt-8 space-y-4">
                <div className="h-10 rounded bg-secondary" />
                <div className="h-10 rounded bg-secondary" />
                <div className="h-10 rounded bg-secondary" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-2xl px-6 py-16 pt-24 lg:pt-20">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            My Account
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account and contact information
          </p>

          <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-4">
            <p className="text-sm text-amber-800">
              Please keep your contact details up to date. We use this information to coordinate auction wins, payments, and delivery of your items.
            </p>
          </div>

          <form onSubmit={handleSave} className="mt-8 space-y-6">
            <div>
              <label className="text-sm font-medium">Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Phone *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 1234567"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm"
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Required for auction coordination and delivery
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">WhatsApp <span className="text-muted-foreground">(optional)</span></label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+92 300 1234567"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
