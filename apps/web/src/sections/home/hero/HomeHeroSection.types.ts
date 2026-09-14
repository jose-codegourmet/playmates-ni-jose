export type CalendarRecording = {
  id: string;
  side: "A" | "B" | "UNASSIGNED";
  part: number;
  youtubeUrl?: string;
  embedUrl?: string;
  driveUrl?: string;
};

export type CalendarGame = {
  id: string;
  number: number | null;
  title: string | null;
  notes: string | null;
  format: string;
  teams: { number: number; label: string; players: string[] }[];
  winnerTeamNo: number | null;
  scores?: { team1: number; team2: number }[] | null;
  recordings: CalendarRecording[];
};

export type CalendarSession = {
  id: string;
  date: string;
  title: string | null;
  venue: string;
  address: string | null;
  court: string | null;
  club: string | null;
  notes: string | null;
  games: CalendarGame[];
};

export type HomeHeroSectionProps = {
  className?: string;
  sessions: CalendarSession[];
  /** Calendar date, supplied by the server to avoid hydration/timezone drift. */
  today: string;
};
