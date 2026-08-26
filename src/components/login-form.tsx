"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000; // 1 minute

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const isLocked = Date.now() < lockedUntil;

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (isLocked) {
        const secs = Math.ceil((lockedUntil - Date.now()) / 1000);
        toast.error(`Too many attempts. Try again in ${secs}s.`);
        return;
      }

      setLoading(true);

      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= MAX_ATTEMPTS) {
          setLockedUntil(Date.now() + LOCKOUT_MS);
          setAttempts(0);
          toast.error("Too many failed attempts. Locked for 1 minute.");
        } else {
          const remaining = MAX_ATTEMPTS - newAttempts;
          toast.error(`${error.message} (${remaining} attempts left)`);
        }

        setLoading(false);
        return;
      }

      // Success — reset counters
      setAttempts(0);
      setLockedUntil(0);
      toast.success("Welcome back!");
      router.push(redirect);
      router.refresh();
    },
    [email, password, attempts, lockedUntil, isLocked, redirect, router]
  );

  return (
    <form onSubmit={handleLogin} className="mt-8 space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full rounded-full"
        disabled={loading || isLocked}
      >
        {isLocked
          ? `Locked — wait ${Math.ceil((lockedUntil - Date.now()) / 1000)}s`
          : loading
            ? "Signing in..."
            : "Sign In"}
      </Button>
    </form>
  );
}
