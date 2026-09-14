import type { Metadata } from "next";
import { Figtree, Manrope } from "next/font/google";
import { Providers } from "@/modules/providers/Providers";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Playmates ni José — Admin",
  description: "Admin portal for the Playmates ni José badminton archive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${figtree.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full min-w-0 overflow-x-clip">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
