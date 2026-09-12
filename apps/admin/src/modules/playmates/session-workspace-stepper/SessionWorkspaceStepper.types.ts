export const SESSION_WORKSPACE_STEP_IDS = [
  "details",
  "players",
  "import",
  "organize",
  "matchups",
  "upload",
  "review",
] as const;

export type StepId = (typeof SESSION_WORKSPACE_STEP_IDS)[number];

export const SESSION_WORKSPACE_STEPS = [
  { id: "details", label: "Details" },
  { id: "players", label: "Players" },
  { id: "import", label: "Import" },
  { id: "organize", label: "Organize" },
  { id: "matchups", label: "Matchups" },
  { id: "upload", label: "Upload" },
  { id: "review", label: "Review" },
] as const satisfies ReadonlyArray<{ id: StepId; label: string }>;

export type SessionWorkspaceStepperProps = {
  current: StepId;
  completed: StepId[];
  hrefFor: (step: StepId) => string;
};
