import { buttonVariants, Logo } from "@fe-template/ui";
import Image from "next/image";
import Link from "next/link";
import { CountUp } from "@/components/jabkit/count-up";
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
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-7xl flex-col justify-center px-5 pt-10 pb-12 sm:px-8 md:pt-16 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-16">
          <div className="max-w-xl">
            <Logo className="h-10 w-auto text-primary sm:h-12" title={DEFAULT_SEO.siteName} />
            <h1 className="mt-6 font-display text-4xl font-extrabold tracking-[-0.02em] text-balance text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.02]">
              Games worth showing up for.
            </h1>
            <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
              {ARCHIVE_SENTENCE}
            </p>
            <div className="mt-8">
              <Link
                href={ROUTES.sessions}
                className={cn(buttonVariants({ size: "lg" }), "rounded-full px-6")}
              >
                Browse sessions
              </Link>
            </div>
          </div>

          {portraits.length > 0 ? (
            <ul className="m-0 grid list-none grid-cols-3 gap-3 p-0 sm:grid-cols-5 lg:grid-cols-2">
              {portraits.slice(0, 4).map((portrait) => (
                <li
                  key={portrait.name}
                  className="relative overflow-hidden rounded-2xl border-2 border-primary bg-card shadow-brand first:col-span-2 first:aspect-4/3 lg:odd:aspect-square lg:first:col-span-2 lg:first:aspect-5/3"
                >
                  <Image
                    src={portrait.src}
                    alt={portrait.alt}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(min-width: 1024px) 14rem, 30vw"
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
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
