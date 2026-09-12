import type { Metadata } from "next";
import { PAGE_SEO } from "@/constants/seo";

export const metadata: Metadata = {
  title: PAGE_SEO.home.title,
  description: PAGE_SEO.home.description,
};

export default function HomePage() {
  return <h1>Playmates ni José</h1>;
}
