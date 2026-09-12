"use client";

import { useTheme } from "next-themes";
import type { FormEvent } from "react";
import { FooterSection } from "@/components/jabkit/footer-section";
import { NAV_LINKS } from "@/constants/navigation";
import { DEFAULT_SEO } from "@/constants/seo";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { setTheme } from "@/store/slices/themeSlice";

type FooterProps = { className?: string };

const FOOTER_LINKS = NAV_LINKS;

function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
}

function Footer({ className }: FooterProps) {
  const dispatch = useAppDispatch();
  const { resolvedTheme } = useTheme();
  const footerTheme = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <FooterSection
      className={cn("mt-auto min-w-0 overflow-x-clip [&_form]:hidden", className)}
      brandTitle={DEFAULT_SEO.siteName}
      brandDescription={DEFAULT_SEO.tagline}
      linksTitle="Browse"
      links={[...FOOTER_LINKS]}
      contactTitle="Archive"
      contactItems={[{ icon: "mail", label: "Archive by José" }]}
      socialTitle="Theme"
      socialLinks={[]}
      legalLinks={[]}
      copyright="Archive by José"
      theme={footerTheme}
      onThemeChange={(next) => dispatch(setTheme(next))}
      showThemeToggle
      onSubmit={handleNewsletterSubmit}
    />
  );
}

export { FOOTER_LINKS, Footer };
