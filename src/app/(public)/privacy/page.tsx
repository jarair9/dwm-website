import { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BackButton } from "@/components/layout/back-button";

export const metadata: Metadata = {
  title: "Privacy Policy | Distinct Mineral World",
  description: "Privacy policy for Distinct Mineral World auction house.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <BackButton />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-20 pt-24 lg:pt-20">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="mt-10 space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
              <p>We collect information you provide directly to us, including:</p>
              <ul className="mt-2 ml-6 list-disc space-y-1">
                <li>Name, email address, phone number, and WhatsApp number when you create an account</li>
                <li>Bidding history and transaction records</li>
                <li>Communications you send to us via contact forms or email</li>
                <li>Payment information processed through our secure payment partners</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="mt-2 ml-6 list-disc space-y-1">
                <li>Process your bids and transactions</li>
                <li>Send you auction notifications and outbid alerts</li>
                <li>Communicate about your account and customer support requests</li>
                <li>Improve our services and user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">3. Information Sharing</h2>
              <p>
                We do not sell your personal information. We may share your information with trusted third parties who assist us in operating our website, processing payments, and providing services to you. These parties are obligated to keep your information confidential.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">4. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">5. Cookies</h2>
              <p>
                We use cookies and similar technologies to maintain your session, remember your preferences, and analyze site usage. You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="mt-2 ml-6 list-disc space-y-1">
                <li>Access, update, or delete your personal information</li>
                <li>Opt out of marketing communications</li>
                <li>Request a copy of your data</li>
                <li>Lodge a complaint with a supervisory authority</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">7. Data Retention</h2>
              <p>
                We retain your personal information for as long as your account is active or as needed to provide you services. We will also retain your information as necessary to comply with legal obligations, resolve disputes, and enforce our agreements.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">8. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &ldquo;Last updated&rdquo; date.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-3">9. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at{" "}
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
