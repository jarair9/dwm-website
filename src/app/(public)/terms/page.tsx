import { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BackButton } from "@/components/layout/back-button";

export const metadata: Metadata = {
  title: "Terms of Service | Distinct Mineral World",
  description: "Terms of service for Distinct Mineral World auction house.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <BackButton />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-20 pt-24 lg:pt-20">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="mt-10 space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Distinct Mineral World (&ldquo;the Website&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Website.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">2. Account Registration</h2>
              <p>To participate in auctions, you must create an account. You agree to:</p>
              <ul className="mt-2 ml-6 list-disc space-y-1">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">3. Bidding and Purchases</h2>
              <p>By placing a bid, you agree that:</p>
              <ul className="mt-2 ml-6 list-disc space-y-1">
                <li>You are legally committed to purchasing the item if you are the winning bidder</li>
                <li>All bids are final and cannot be retracted except in exceptional circumstances</li>
                <li>Payment must be completed within the timeframe specified in the invoice</li>
                <li>You are at least 18 years of age and legally capable of entering binding contracts</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">4. Pricing and Payment</h2>
              <p>
                All prices are listed in USD. Payment is processed via WhatsApp or email communication. We accept bank transfers and other methods as agreed upon. Failure to complete payment may result in account suspension and forfeiture of the item.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">5. Shipping and Delivery</h2>
              <p>
                Items are shipped after payment confirmation. Shipping costs and timelines vary by destination. Please refer to our Shipping Policy for detailed information. Risk of loss transfers to the buyer upon delivery to the carrier.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">6. Authenticity Guarantee</h2>
              <p>
                We strive to accurately describe all items. Minerals and gemstones are natural products and may vary from photographs. We guarantee authenticity as described in the lot listing. Disputes regarding authenticity must be raised within 7 days of delivery with supporting documentation.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">7. Prohibited Conduct</h2>
              <p>You agree not to:</p>
              <ul className="mt-2 ml-6 list-disc space-y-1">
                <li>Use automated tools to place bids</li>
                <li>Manipulate bids or collude with other bidders</li>
                <li>Interfere with the proper functioning of the Website</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">8. Limitation of Liability</h2>
              <p>
                Distinct Mineral World shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Website or participation in auctions. Our total liability shall not exceed the amount you paid for the specific transaction.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">9. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that violates these Terms or is harmful to other users or the Website.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">10. Governing Law</h2>
              <p>
                These Terms are governed by and construed in accordance with applicable laws. Any disputes shall be resolved through good-faith negotiation first, and if unresolved, through binding arbitration.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">11. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. Changes will be effective upon posting to the Website. Your continued use of the Website constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">12. Contact Us</h2>
              <p>
                For questions about these Terms, contact us at{" "}
                <a href="mailto:rofaqalam007@gmail.com" className="underline hover:text-foreground">rofaqalam007@gmail.com</a>{" "}
                or via WhatsApp at{" "}
                <a href="https://wa.me/923109962623" className="underline hover:text-foreground">+92 310 996 2623</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
