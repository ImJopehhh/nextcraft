import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/components/Layout/LoadingScreen";
import GuestLayoutWrapper from "@/components/Layout/GuestLayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NextCraft - Digital Excellence",
  description: "Modern digital solutions for your business success.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050b18] text-white`}
      >
        <LoadingScreen />
        <GuestLayoutWrapper>
          {children}
        </GuestLayoutWrapper>
        <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] grayscale bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
      </body>
    </html>
  );
}
