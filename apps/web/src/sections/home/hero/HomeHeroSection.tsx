import { buttonVariants } from "@fe-template/ui";
import Link from "next/link";
import { CountUp } from "@/components/jabkit/count-up";
import { Hero228 } from "@/components/jabkit/hero228";
import { ROUTES } from "@/constants/routes";
import { DEFAULT_SEO } from "@/constants/seo";
import { cn } from "@/lib/utils";

import type { HomeHeroSectionProps } from "./HomeHeroSection.types";

const ARCHIVE_SENTENCE =
  "A public archive of badminton sessions, published games, and the people who played them.";

function HomeHeroSection({
  className,
  sessionCount = 0,
  gameCount = 0,
  portraits = [],
}: HomeHeroSectionProps) {
  const showCounts = sessionCount > 0 || gameCount > 0;

  return (
    <section
      data-slot="home-hero-section"
      className={cn("overflow-x-clip bg-background", className)}
    >
      {portraits.length > 0 ? (
        <Hero228
          headline={[{ text: "Playmates " }, { text: "ni José", italic: true }]}
          description={ARCHIVE_SENTENCE}
          portraits={portraits}
          autoplay={false}
        />
      ) : (
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-16 text-center sm:px-8 sm:py-20">
          <h1 className="max-w-2xl text-4xl leading-[1.08] font-medium tracking-[-0.04em] text-balance sm:text-5xl md:text-6xl">
            Playmates <span className="font-serif font-normal italic">ni José</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {ARCHIVE_SENTENCE}
          </p>
        </div>
      )}
      <div className="flex justify-center px-5 pb-10 sm:px-8">
        <Link href={ROUTES.sessions} className={buttonVariants({ size: "lg" })}>
          Browse sessions
        </Link>
      </div>
      {showCounts ? (
        <CountUp
          align="center"
          description={`${DEFAULT_SEO.siteName} publishes sessions and games when they are ready to watch.`}
          eyebrow="In the archive"
          items={[
            { to: sessionCount, suffix: "", label: "Public sessions" },
            { to: gameCount, suffix: "", label: "Public games" },
          ]}
          suffix=""
        />
      ) : null}
    </section>
  );
}

export type { HomeHeroSectionProps };
export { HomeHeroSection };
