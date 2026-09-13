export type SessionRosterPlayer = {
  id: string;
  displayName: string;
};

export type SessionRosterEditorProps = {
  sessionId: string;
  players: SessionRosterPlayer[];
  selectedPlayerIds: string[];
  preservedPlayerIds?: string[];
};
