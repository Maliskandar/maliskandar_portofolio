// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import ScrollProgress from "@/components/ScrollProgress";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira" });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Muhammad Akmal Iskandar | Portfolio",
    template: "%s | Muhammad Akmal Iskandar",
  },
  description:
    "Full Stack Developer — Laravel, React, and TypeScript. Building scalable backends and exceptional frontends.",
  keywords: [
    "Muhammad Akmal Iskandar",
    "Full Stack Developer",
    "Laravel Developer",
    "React Developer",
    "Portfolio",
    "Indonesia",
  ],
  authors: [{ name: "Muhammad Akmal Iskandar" }],
  creator: "Muhammad Akmal Iskandar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Muhammad Akmal Iskandar",
    title: "Muhammad Akmal Iskandar | Portfolio",
    description:
      "Full Stack Developer — Laravel, React, and TypeScript. Building scalable backends and exceptional frontends.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Akmal Iskandar | Portfolio",
    description:
      "Full Stack Developer — Laravel, React, and TypeScript. Building scalable backends and exceptional frontends.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* TAMBAHKAN suppressHydrationWarning={true} DI BAWAH INI */}
      <body
        suppressHydrationWarning={true}
        className={`${inter.variable} ${firaCode.variable} bg-dark text-white antialiased`}
      >
        <LenisProvider>
          <ScrollProgress />
          <CustomCursor />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}