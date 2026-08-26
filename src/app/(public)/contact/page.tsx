import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ContactForm } from "@/components/contact-form";

export const metadata = {
  title: "Contact | Distinct Mineral World",
  description:
    "Have a question about a specimen, need authentication assistance, or want to consign a piece? We're here to help.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-background py-24 pt-32 lg:pt-28">
          <div className="mx-auto max-w-4xl px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Contact
              </p>
              <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground">
                Get in Touch
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Have a question about a specimen, need authentication assistance,
                or want to consign a piece? We&apos;re here to help.
              </p>
            </div>

            <div className="mt-16 grid gap-12 lg:grid-cols-2">
              <ContactForm />

              <div className="space-y-8">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-foreground">
                    Auction Inquiries
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    For questions about specific lots, bidding procedures, or
                    consignment opportunities.
                  </p>
                  <a
                    href="mailto:rofaqalam007@gmail.com"
                    className="mt-2 inline-block text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
                  >
                    rofaqalam007@gmail.com
                  </a>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-semibold text-foreground">
                    Authentication
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    For certificate verification, grading reports, or gemological
                    consultations.
                  </p>
                  <a
                    href="mailto:rofaqalam007@gmail.com"
                    className="mt-2 inline-block text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
                  >
                    rofaqalam007@gmail.com
                  </a>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-semibold text-foreground">
                    WhatsApp
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    For quick inquiries and real-time auction updates.
                  </p>
                  <a
                    href="https://wa.me/923109962623"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
                  >
                    Chat on WhatsApp
                  </a>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-semibold text-foreground">
                    Call Us
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    For immediate assistance and inquiries.
                  </p>
                  <a
                    href="tel:+923109962623"
                    className="mt-2 inline-block text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
                  >
                    +92 310 9962623
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
