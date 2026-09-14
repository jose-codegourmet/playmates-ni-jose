import { formatSessionDisplayDate } from "@fe-template/mocks";
import { cn } from "@/lib/utils";

import type { SessionDetailHeaderSectionProps } from "./SessionDetailHeaderSection.types";

function SessionDetailHeaderSection({
  className,
  sessionDate,
  title,
  venueName,
  notes,
}: SessionDetailHeaderSectionProps) {
  const displayDate = formatSessionDisplayDate(sessionDate);
  const heading = title?.trim() || displayDate;
  const showDateLine = Boolean(title?.trim());
  const venue = venueName?.trim() || null;
  const note = notes?.trim() || null;

  return (
    <section
      data-slot="session-detail-header-section"
      className={cn("nb-band bg-accent-mango px-4 pt-10 pb-8 sm:px-6 sm:pt-12 lg:px-8", className)}
    >
      <div className="mx-auto max-w-7xl">
        {showDateLine ? (
          <time
            dateTime={sessionDate}
            className="text-sm font-bold tracking-wide text-ink uppercase"
          >
            {displayDate}
          </time>
        ) : (
          <time dateTime={sessionDate} className="sr-only">
            {displayDate}
          </time>
        )}
        <h1
          className={cn("font-display text-5xl tracking-tight md:text-6xl", showDateLine && "mt-2")}
        >
          {heading}
        </h1>
        {venue ? <p className="mt-4 text-base text-ink md:text-lg">{venue}</p> : null}
        {note ? <p className="mt-3 max-w-2xl text-base leading-relaxed">{note}</p> : null}
      </div>
    </section>
  );
}

export type { SessionDetailHeaderSectionProps };
export { SessionDetailHeaderSection };
