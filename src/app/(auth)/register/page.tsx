import Link from "next/link";
import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
        Create Account
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Join our community of collectors and gem enthusiasts.
      </p>

      <RegisterForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
