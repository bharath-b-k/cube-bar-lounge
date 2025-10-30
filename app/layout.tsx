import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Cube Bar Lounge | Premium Shisha, West African Cuisine & Live Music",
  description:
    "Experience the ultimate nightlife at Cube Bar Lounge. Book tables for premium shisha, authentic West African food, live DJ nights, and private events in Nuneaton.",
  keywords: [
    "shisha lounge",
    "african food",
    "nightclub nuneaton",
    "jollof rice",
    "suya",
    "live DJ",
    "private events",
    "hookah bar",
  ],
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#7c3aed" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
} as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
