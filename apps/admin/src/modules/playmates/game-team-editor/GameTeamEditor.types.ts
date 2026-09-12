export type GameTeamRosterPlayer = {
  id: string;
  displayName: string;
};

export type GameTeamEditorValue = {
  team1: string[];
  team2: string[];
};

export type GameTeamEditorProps = {
  roster: GameTeamRosterPlayer[];
  team1: string[];
  team2: string[];
  onChange: (next: GameTeamEditorValue) => void;
  onCopyPrevious?: () => void;
  className?: string;
};
