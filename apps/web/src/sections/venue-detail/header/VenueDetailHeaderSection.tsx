import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

import type { VenueDetailHeaderSectionProps } from "./VenueDetailHeaderSection.types";

function VenueDetailHeaderSection({
  className,
  name,
  address,
  notes,
}: VenueDetailHeaderSectionProps) {
  const addressLabel = address?.trim() || null;
  const note = notes?.trim() || null;

  return (
    <section
      data-slot="venue-detail-header-section"
      className={cn("mx-auto max-w-7xl px-4 pt-12 pb-4 sm:px-6 sm:pt-16 lg:px-8", className)}
    >
      <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">Venue</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight md:text-5xl">
        {name}
      </h1>
      {addressLabel ? (
        <p className="mt-4 text-base text-muted-foreground md:text-lg">{addressLabel}</p>
      ) : null}
      {note ? <p className="mt-3 max-w-2xl text-base leading-relaxed">{note}</p> : null}
      <p className="mt-6">
        <Link
          href={ROUTES.venues}
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          All venues
        </Link>
      </p>
    </section>
  );
}

export type { VenueDetailHeaderSectionProps };
export { VenueDetailHeaderSection };
