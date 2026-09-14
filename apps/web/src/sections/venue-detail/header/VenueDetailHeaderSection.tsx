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
      className={cn("nb-band bg-accent-lilac px-4 pt-10 pb-8 sm:px-6 sm:pt-12 lg:px-8", className)}
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold tracking-wide text-ink uppercase">Venue</p>
        <h1 className="mt-2 font-display text-5xl tracking-tight md:text-6xl">{name}</h1>
        {addressLabel ? <p className="mt-4 text-base text-ink md:text-lg">{addressLabel}</p> : null}
        {note ? <p className="mt-3 max-w-2xl text-base leading-relaxed">{note}</p> : null}
        <p className="mt-6">
          <Link
            href={ROUTES.venues}
            className="text-sm font-bold uppercase tracking-wide text-ink underline-offset-4 hover:underline"
          >
            All venues
          </Link>
        </p>
      </div>
    </section>
  );
}

export type { VenueDetailHeaderSectionProps };
export { VenueDetailHeaderSection };
