import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://squamishadventurerentals.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Squamish Adventure Rentals — ATV Rentals Delivered to Your Trailhead",
    template: "%s · Squamish Adventure Rentals",
  },
  description:
    "Premium ATV rentals delivered anywhere in the Sea-to-Sky corridor. Helmets, gear, and a thorough safety briefing included. Book end-to-end through our 24/7 chat assistant.",
  keywords: [
    "ATV rentals Squamish",
    "quad rentals BC",
    "Sea-to-Sky ATV",
    "Squamish adventures",
    "off-road rentals Whistler",
  ],
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: siteUrl,
    siteName: "Squamish Adventure Rentals",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-fg">
        {children}
      </body>
    </html>
  );
}
