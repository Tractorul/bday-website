import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "bday website",
  description: "𝓶𝓪𝓭𝓮 𝔀𝓲𝓽𝓱 ❤️,𝓼𝔀𝓮𝓪𝓽 𝓪𝓷𝓭 𝓽𝓮𝓪𝓻𝓼 𝓫𝔂 𝓪𝓷𝓭𝓻𝓮𝓾𝓹𝓽𝓶",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
