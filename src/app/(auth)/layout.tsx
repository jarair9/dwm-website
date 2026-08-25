import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden w-1/2 bg-foreground lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div className="px-12 text-center">
          <Link href="/" className="font-serif text-3xl font-bold text-white">
            Distinct Mineral World
          </Link>
          <p className="mt-4 max-w-sm text-lg text-white/70">
            A curated digital auction house for rare minerals and gemstones.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
