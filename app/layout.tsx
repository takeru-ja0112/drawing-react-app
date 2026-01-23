import Header from "@/components/organisms/Header";
import { SoundProvider } from "@/components/SoundProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BgObject from "@/components/organisms/BgObject";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Minimal Draw",
  description: "Mini app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/minimalDrawIcon.svg" />
        <link rel="manifest" href="manifest.json"/>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen`}
      >
        <BgObject />
        <SoundProvider>
          {/* ヘッダーの高さ分全体をさげる */}
          <Header />
            <div className="pt-14">{children}</div>
          <footer className="text-center p-4 text-gray-500 text-sm">
            &copy; 2026, Takeru
          </footer>
        </SoundProvider>
      </body>
    </html>
  );
}
