import Image from "next/image";
import { PAGE_SEO } from "@/constants/seo";
import { cn } from "@/lib/utils";

import type { SessionsHeroSectionProps } from "./SessionsHeroSection.types";

function SessionsHeroSection({ className }: SessionsHeroSectionProps) {
  return (
    <section
      data-slot="sessions-hero-section"
      className={cn("nb-band bg-accent-mango px-4 pt-10 pb-8 sm:px-6 sm:pt-12 lg:px-8", className)}
    >
      <div className="relative mx-auto max-w-7xl">
        <Image
          src="/images/mascot/sticker-serve.png"
          alt=""
          width={160}
          height={160}
          className="pointer-events-none absolute top-0 right-0 hidden w-28 rotate-6 md:block"
        />
        <h1 className="font-display text-5xl tracking-tight md:text-7xl">Sessions</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink md:text-lg">
          {PAGE_SEO.sessions.description}
        </p>
      </div>
    </section>
  );
}

export type { SessionsHeroSectionProps };
export { SessionsHeroSection };
