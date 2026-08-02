import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Ayodeleart",
  description: "An art portfolio — step into the gallery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <head>
        <link rel="preload" as="image" href="/hero/hero-desktop.webp" media="(min-width: 768px)" />
        <link rel="preload" as="image" href="/hero/hero-mobile.webp" media="(max-width: 767px)" />
      </head>
      <body className="font-body">{children}</body>
    </html>
  );
}
