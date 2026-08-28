import { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about our mission to curate and present museum-quality gemstones and minerals.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-background py-24 pt-32 lg:pt-28">
          <div className="mx-auto max-w-4xl px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                About Us
              </p>
              <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground">
                The Art of Rare Minerals
              </h1>
            </div>

            <div className="mt-16 space-y-8 text-lg leading-relaxed text-muted-foreground">
              <p>
                Distinct Mineral World was founded with a singular vision: to
                create a digital auction house that treats rare minerals and
                gemstones with the reverence they deserve. We believe that
                extraordinary natural specimens deserve extraordinary
                presentation.
              </p>
              <p>
                Our team comprises gemologists, geologists, and mineral
                enthusiasts who collectively bring decades of experience in the
                gemstone industry. Every specimen that enters our collection
                undergoes rigorous authentication and grading by certified
                gemologists.
              </p>
              <p>
                We work directly with miners, collectors, and authorized dealers
                worldwide to source the finest specimens. Each stone is verified
                for its geological origin, treatment history, and authenticity
                through leading gemological laboratories including GIA, Gübelin,
                and SSEF.
              </p>
              <p>
                Our commitment extends beyond authentication. We believe in
                ethical sourcing and full transparency. Every specimen in our
                auction comes with complete provenance documentation and
                certification.
              </p>
            </div>

            {/* Values */}
            <div className="mt-20 grid gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <svg
                    className="h-8 w-8 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
                  Authenticity
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Every specimen verified by GIA, Gübelin, or SSEF certified
                  gemologists.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <svg
                    className="h-8 w-8 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
                  Global Sourcing
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Direct relationships with miners and dealers in 50+ countries
                  worldwide.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <svg
                    className="h-8 w-8 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
                  Ethical Practice
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Conflict-free guarantee with full provenance documentation for
                  every stone.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
