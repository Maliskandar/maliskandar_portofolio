// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira" });

export const metadata: Metadata = {
  title: "Muhammad Akmal Iskandar | Portfolio",
  description: "Full Stack Developer Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      {/* TAMBAHKAN suppressHydrationWarning={true} DI BAWAH INI */}
      <body
        suppressHydrationWarning={true}
        className={`${inter.variable} ${firaCode.variable} bg-dark text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}