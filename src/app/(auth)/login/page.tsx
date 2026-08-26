import { Suspense } from "react";
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


    </div>
  );
}
