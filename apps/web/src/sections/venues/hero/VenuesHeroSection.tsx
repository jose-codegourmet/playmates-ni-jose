import { PAGE_SEO } from "@/constants/seo";
import { cn } from "@/lib/utils";

import type { VenuesHeroSectionProps } from "./VenuesHeroSection.types";

function VenuesHeroSection({ className }: VenuesHeroSectionProps) {
  return (
    <section
      data-slot="venues-hero-section"
      className={cn("mx-auto max-w-7xl px-4 pt-12 pb-4 sm:px-6 sm:pt-16 lg:px-8", className)}
    >
      <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">Venues</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
        {PAGE_SEO.venues.description}
      </p>
    </section>
  );
}

export type { VenuesHeroSectionProps };
export { VenuesHeroSection };
