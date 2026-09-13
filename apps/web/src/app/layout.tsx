import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { DEFAULT_SEO } from "@/constants/seo";
import { Footer } from "@/modules/layout/footer/Footer";
import { Header } from "@/modules/layout/navigation/header/Header";
import { Providers } from "@/modules/providers/Providers";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK"],
});

export const metadata: Metadata = {
  title: DEFAULT_SEO.title,
  description: DEFAULT_SEO.description,
  openGraph: {
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    siteName: DEFAULT_SEO.siteName,
    images: [{ url: DEFAULT_SEO.ogImage, width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full min-w-0 flex-col overflow-x-clip">
        <Providers>
          <Header />
          <main className="min-h-0 flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
