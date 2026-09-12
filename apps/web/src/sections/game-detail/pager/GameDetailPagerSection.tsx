import { buttonVariants } from "@fe-template/ui";
import Link from "next/link";
import { cn } from "@/lib/utils";

import type { GameDetailPagerSectionProps } from "./GameDetailPagerSection.types";

function GameDetailPagerSection({ className, previous, next }: GameDetailPagerSectionProps) {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav
      aria-label="Adjacent games"
      data-slot="game-detail-pager-section"
      className={cn(
        "mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 pb-16 sm:px-6 lg:px-8",
        className,
      )}
    >
      {previous ? (
        <Link href={previous.href} className={buttonVariants({ variant: "outline" })}>
          Previous · Game {previous.gameNumber}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} className={buttonVariants({ variant: "outline" })}>
          Next · Game {next.gameNumber}
        </Link>
      ) : null}
    </nav>
  );
}

export type { GameDetailPagerSectionProps };
export { GameDetailPagerSection };
