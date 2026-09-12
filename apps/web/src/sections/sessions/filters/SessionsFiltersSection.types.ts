import type { Player, Venue } from "@fe-template/mocks";
import type { PublicSessionFilters } from "@/hooks/use-public-sessions/types";

export type SessionsFiltersSectionProps = {
  className?: string;
  players: Player[];
  venues: Venue[];
  value: PublicSessionFilters;
  onChange: (next: PublicSessionFilters) => void;
};
