import type { Metadata } from "next";
import { Figtree, Manrope } from "next/font/google";
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

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800", "900"],
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
      className={`${manrope.variable} ${figtree.variable} h-full antialiased`}
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
