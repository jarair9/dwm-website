import { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BackButton } from "@/components/layout/back-button";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Shipping and delivery information for Distinct Mineral World.",
};

export default function ShippingPage() {
  return (
    <>
      <Navbar />
      <BackButton />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-20 pt-24 lg:pt-20">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground">
            Shipping Policy
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="mt-10 space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">1. Processing Time</h2>
              <p>
                Orders are processed within 2-3 business days after payment confirmation. You will receive a tracking number via email or WhatsApp once your item has been shipped.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">2. Domestic Shipping (Pakistan)</h2>
              <ul className="ml-6 list-disc space-y-1">
                <li><strong>Standard Delivery:</strong> 3-5 business days</li>
                <li><strong>Express Delivery:</strong> 1-2 business days</li>
                <li>All domestic shipments are insured and require signature on delivery</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">3. International Shipping</h2>
              <ul className="ml-6 list-disc space-y-1">
                <li><strong>Standard International:</strong> 7-14 business days</li>
                <li><strong>Express International:</strong> 3-5 business days</li>
                <li>International shipments are fully insured against loss and damage</li>
                <li>Tracking is provided for all international shipments</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">4. Shipping Costs</h2>
              <p>
                Shipping costs are calculated based on destination, weight, and insurance value. Exact shipping costs will be communicated to you before payment. We use premium courier services to ensure safe delivery of your specimens.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">5. Packaging</h2>
              <p>
                All specimens are professionally packaged in custom-fitted boxes with appropriate cushioning materials. Fragile items receive additional protective packaging. Each package includes handling instructions to ensure safe receipt.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">6. Insurance</h2>
              <p>
                Every shipment is fully insured for the declared value. In the rare event of damage during transit, please contact us immediately with photos of the damaged packaging and item. We will arrange a replacement or full refund.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">7. Customs and Duties</h2>
              <p>
                International buyers are responsible for any customs duties, taxes, or import fees imposed by their country. These charges are not included in the item price or shipping cost. We recommend checking with your local customs office for estimated fees.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">8. Delivery Confirmation</h2>
              <p>
                All shipments require signature on delivery. If you are unavailable, the carrier will leave a delivery notice with instructions for redelivery or pickup. Please ensure someone is available at the delivery address.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">9. Lost or Delayed Shipments</h2>
              <p>
                If your shipment has not arrived within the estimated timeframe, please contact us. We will investigate with the carrier and provide a resolution, which may include reshipment or full refund.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">10. Contact Us</h2>
              <p>
                For shipping inquiries, contact us at{" "}
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
