"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-serif text-6xl font-bold text-foreground">500</p>
      <h2 className="mt-4 font-serif text-2xl font-semibold text-foreground">
        Something went wrong
      </h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        An unexpected error occurred. Please try again or contact support if
        the problem persists.
      </p>
      <Button onClick={reset} className="mt-8 rounded-full">
        Try Again
      </Button>
    </div>
  );
}
