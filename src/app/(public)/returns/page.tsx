import { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BackButton } from "@/components/layout/back-button";

export const metadata: Metadata = {
  title: "Return & Refund Policy | Distinct Mineral World",
  description: "Return and refund policy for Distinct Mineral World auction house.",
};

export default function ReturnsPage() {
  return (
    <>
      <Navbar />
      <BackButton />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-20 pt-24 lg:pt-20">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground">
            Return &amp; Refund Policy
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="mt-10 space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">1. Authenticity Guarantee</h2>
              <p>
                We stand behind the authenticity of every specimen we sell. All minerals and gemstones are professionally evaluated and accurately described. If an item is found to be inauthentic or materially different from its description, you may return it for a full refund.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">2. Return Window</h2>
              <p>
                You have 7 days from the date of delivery to request a return. Returns requested after this period may not be accepted unless the item is covered under our authenticity guarantee.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">3. Eligible Returns</h2>
              <p>We accept returns for the following reasons:</p>
              <ul className="mt-2 ml-6 list-disc space-y-1">
                <li>The item is inauthentic or misidentified</li>
                <li>The item differs materially from the listing description</li>
                <li>The item arrived damaged during shipping</li>
                <li>The wrong item was shipped</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">4. Non-Eligible Returns</h2>
              <p>Returns will not be accepted for:</p>
              <ul className="mt-2 ml-6 list-disc space-y-1">
                <li>Buyer&apos;s remorse or change of mind</li>
                <li>Natural variations in color, inclusion patterns, or crystal formation (these are inherent characteristics of natural specimens)</li>
                <li>Minor surface scratches or inclusions not visible in listing photos but consistent with natural specimens</li>
                <li>Items returned without original packaging</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">5. Return Process</h2>
              <p>To initiate a return:</p>
              <ul className="mt-2 ml-6 list-disc space-y-1">
                <li>Contact us via email or WhatsApp with your order details and reason for return</li>
                <li>Provide photographs of the item and packaging</li>
                <li>Wait for return authorization before shipping the item back</li>
                <li>Ship the item in its original packaging with tracking and insurance</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">6. Refund Process</h2>
              <p>
                Once we receive and inspect the returned item, we will process your refund within 5-7 business days. Refunds are issued to the original payment method. Shipping costs are non-refundable unless the return is due to our error.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">7. Damaged Shipments</h2>
              <p>
                If your item arrives damaged, contact us within 48 hours of delivery with photographs of the damage. We will arrange a full refund or replacement at no additional cost. Do not dispose of the damaged item or packaging until instructed.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">8. Exchange Policy</h2>
              <p>
                We do not offer direct exchanges. If you wish to purchase a different item, please return the original item for a refund and place a new order.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">9. Contact Us</h2>
              <p>
                For return or refund inquiries, contact us at{" "}
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
