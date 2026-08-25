import type { Metadata } from "next";
import { Inter, Playfair_Display, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Distinct Mineral World — Rare Gemstone Auctions",
    template: "%s | Distinct Mineral World",
  },
  description:
    "A curated digital auction house for rare minerals and gemstones. Discover museum-quality specimens from around the world, verified by GIA, Gübelin, and SSEF.",
  keywords: [
    "gemstones",
    "minerals",
    "auction",
    "rare minerals",
    "sapphire",
    "ruby",
    "emerald",
    "diamond",
    "collectible",
    "museum quality",
    "certified gemstones",
  ],
  authors: [{ name: "Distinct Mineral World" }],
  creator: "Distinct Mineral World",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Distinct Mineral World",
    title: "Distinct Mineral World — Rare Gemstone Auctions",
    description:
      "A curated digital auction house for rare minerals and gemstones.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Distinct Mineral World — Rare Gemstone Auctions",
    description:
      "A curated digital auction house for rare minerals and gemstones.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
