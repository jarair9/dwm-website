import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-serif text-6xl font-bold text-foreground">404</p>
      <h2 className="mt-4 font-serif text-2xl font-semibold text-foreground">
        Page Not Found
      </h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="mt-8">
        <Button className="rounded-full">Back to Home</Button>
      </Link>
    </div>
  );
}
