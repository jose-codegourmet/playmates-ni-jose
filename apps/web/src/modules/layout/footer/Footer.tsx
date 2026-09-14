"use client";

import { Logo } from "@fe-template/ui";
import Image from "next/image";
import type { FormEvent } from "react";
import { FooterSection } from "@/components/jabkit/footer-section";
import { NAV_LINKS } from "@/constants/navigation";
import { DEFAULT_SEO } from "@/constants/seo";
import { cn } from "@/lib/utils";

type FooterProps = { className?: string };

const FOOTER_LINKS = NAV_LINKS;

const MARQUEE_ITEMS = [
  "Tara, laro tayo",
  "Playmates ni José",
  "Badminton archive",
  "Games, sides, links",
];

function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
}

function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("mt-auto min-w-0 overflow-x-clip", className)}>
      <div className="nb-marquee" aria-hidden="true">
        <div className="nb-marquee-track">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex">
              {MARQUEE_ITEMS.map((item) => (
                <span key={`${copy}-${item}`} className="nb-marquee-item">
                  {item}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <FooterSection
        className="min-w-0 overflow-x-clip border-t-[3px] border-ink bg-brand-green text-brand-cream [&_.blur-3xl]:hidden [&_form]:hidden [&_h3]:text-brand-cream [&_nav_a]:inline-flex [&_nav_a]:min-h-10 [&_nav_a]:items-center [&_p]:text-brand-cream/80 [&_span]:text-brand-cream/80"
        brandTitle={DEFAULT_SEO.siteName}
        brandMark={
          <span className="flex items-end gap-3">
            <Image
              src="/images/mascot/sign.png"
              alt=""
              width={72}
              height={72}
              className="hidden h-18 w-18 object-contain sm:block"
            />
            <Logo className="h-10 w-auto text-brand-cream" />
          </span>
        }
        brandDescription={DEFAULT_SEO.tagline}
        linksTitle="Browse"
        links={[...FOOTER_LINKS]}
        contactTitle="Archive"
        contactItems={[{ icon: "mail", label: "Archive by José" }]}
        socialTitle=""
        socialLinks={[]}
        legalLinks={[]}
        copyright="Archive by José"
        theme="light"
        showThemeToggle={false}
        onSubmit={handleNewsletterSubmit}
      />
    </footer>
  );
}

export { FOOTER_LINKS, Footer };
