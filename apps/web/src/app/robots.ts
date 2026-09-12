import type { MetadataRoute } from "next";

const FALLBACK_SITE_URL = "http://localhost:9000";

function siteOrigin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL).replace(/\/$/, "");
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteOrigin()}/sitemap.xml`,
  };
}
