"use client";

import { useState } from "react";

interface ContactModalProps {
  productName: string;
  productPrice: number;
}

export function ContactModal({ productName, productPrice }: ContactModalProps) {
  const [open, setOpen] = useState(false);

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in "${productName}" priced at $${productPrice.toLocaleString()}. Is it still available?`
  );
  const emailSubject = encodeURIComponent(`Inquiry: ${productName}`);
  const emailBody = encodeURIComponent(
    `Hi, I'm interested in "${productName}" priced at $${productPrice.toLocaleString()}. Is it still available? Thank you.`
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-full bg-foreground py-3.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
      >
        Contact to Purchase
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="font-serif text-xl font-bold text-foreground">
              Contact Us
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {productName} — ${productPrice.toLocaleString()}
            </p>

            <div className="mt-6 space-y-3">
              <a
                href={`https://wa.me/923109962623?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-secondary"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">WhatsApp</p>
                  <p className="text-xs text-muted-foreground">Chat with us directly</p>
                </div>
              </a>

              <a
                href={`mailto:rofaqalam007@gmail.com?subject=${emailSubject}&body=${emailBody}`}
                className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-secondary"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-xs text-muted-foreground">Send us an inquiry</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
