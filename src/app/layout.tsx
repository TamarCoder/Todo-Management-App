import type { Metadata } from "next";
import { Hanken_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { StoreInitializer } from "@/components/StoreInitializer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "FocusFlow",
  description: "A focused, distraction-free task management workspace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${hanken.variable} ${mono.variable}`}>
      <body>
        <StoreInitializer>{children}</StoreInitializer>
      </body>
    </html>
  );
}
