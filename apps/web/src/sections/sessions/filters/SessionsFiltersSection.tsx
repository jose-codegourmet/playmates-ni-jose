"use client";

import { Button, Input, Label, NativeSelect, NativeSelectOption } from "@fe-template/ui";
import type { PublicSessionFilters } from "@/hooks/use-public-sessions/types";
import { cn } from "@/lib/utils";

import type { SessionsFiltersSectionProps } from "./SessionsFiltersSection.types";

function SessionsFiltersSection({
  className,
  players,
  venues,
  value,
  onChange,
}: SessionsFiltersSectionProps) {
  const sortedPlayers = [...players].sort((a, b) => a.displayName.localeCompare(b.displayName));
  const sortedVenues = [...venues].sort((a, b) => a.name.localeCompare(b.name));

  function patch(partial: PublicSessionFilters) {
    onChange({ ...value, ...partial });
  }

  function reset() {
    onChange({});
  }

  const hasActiveFilter = Boolean(
    value.date?.trim() || value.player?.trim() || value.venue?.trim(),
  );

  return (
    <section
      data-slot="sessions-filters-section"
      className={cn("mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8", className)}
    >
      <form
        className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="flex min-w-40 flex-1 flex-col gap-2">
          <Label htmlFor="sessions-filter-date">Date</Label>
          <Input
            id="sessions-filter-date"
            type="date"
            value={value.date ?? ""}
            onChange={(event) => patch({ date: event.target.value })}
          />
        </div>
        <div className="flex min-w-40 flex-1 flex-col gap-2">
          <Label htmlFor="sessions-filter-player">Player</Label>
          <NativeSelect
            id="sessions-filter-player"
            className="w-full"
            value={value.player ?? ""}
            onChange={(event) => patch({ player: event.target.value })}
          >
            <NativeSelectOption value="">All players</NativeSelectOption>
            {sortedPlayers.map((player) => (
              <NativeSelectOption key={player.id} value={player.displayName}>
                {player.displayName}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        <div className="flex min-w-40 flex-1 flex-col gap-2">
          <Label htmlFor="sessions-filter-venue">Venue</Label>
          <NativeSelect
            id="sessions-filter-venue"
            className="w-full"
            value={value.venue ?? ""}
            onChange={(event) => patch({ venue: event.target.value })}
          >
            <NativeSelectOption value="">All venues</NativeSelectOption>
            {sortedVenues.map((venue) => (
              <NativeSelectOption key={venue.id} value={venue.name}>
                {venue.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        <Button type="button" variant="outline" disabled={!hasActiveFilter} onClick={reset}>
          Reset
        </Button>
      </form>
    </section>
  );
}

export type { SessionsFiltersSectionProps };
export { SessionsFiltersSection };
