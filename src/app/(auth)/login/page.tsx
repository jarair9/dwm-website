import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
        Welcome Back
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign in to place bids and track your auctions.
      </p>

      <Suspense fallback={<div className="mt-8 space-y-5">Loading...</div>}>
        <LoginForm />
      </Suspense>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
