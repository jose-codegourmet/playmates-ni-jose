import Image from "next/image";
import { PAGE_SEO } from "@/constants/seo";
import { cn } from "@/lib/utils";

import type { PlayersHeroSectionProps } from "./PlayersHeroSection.types";

function PlayersHeroSection({ className }: PlayersHeroSectionProps) {
  return (
    <section
      data-slot="players-hero-section"
      className={cn("nb-band bg-accent-sky px-4 pt-10 pb-8 sm:px-6 sm:pt-12 lg:px-8", className)}
    >
      <div className="relative mx-auto max-w-7xl">
        <Image
          src="/images/mascot/sticker-cam.png"
          alt=""
          width={160}
          height={160}
          className="pointer-events-none absolute top-0 right-0 hidden w-28 -rotate-6 md:block"
        />
        <h1 className="font-display text-5xl tracking-tight md:text-7xl">Players</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink md:text-lg">
          {PAGE_SEO.players.description}
        </p>
      </div>
    </section>
  );
}

export type { PlayersHeroSectionProps };
export { PlayersHeroSection };
