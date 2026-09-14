import Image from "next/image";
import { PAGE_SEO } from "@/constants/seo";
import { cn } from "@/lib/utils";

import type { VenuesHeroSectionProps } from "./VenuesHeroSection.types";

function VenuesHeroSection({ className }: VenuesHeroSectionProps) {
  return (
    <section
      data-slot="venues-hero-section"
      className={cn("nb-band bg-accent-lilac px-4 pt-10 pb-8 sm:px-6 sm:pt-12 lg:px-8", className)}
    >
      <div className="relative mx-auto max-w-7xl">
        <Image
          src="/images/mascot/sticker-head.png"
          alt=""
          width={140}
          height={140}
          className="pointer-events-none absolute top-0 right-0 hidden w-24 rotate-3 md:block"
        />
        <h1 className="font-display text-5xl tracking-tight md:text-7xl">Venues</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink md:text-lg">
          {PAGE_SEO.venues.description}
        </p>
      </div>
    </section>
  );
}

export type { VenuesHeroSectionProps };
export { VenuesHeroSection };
