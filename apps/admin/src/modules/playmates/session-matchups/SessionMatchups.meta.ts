import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "session-matchups",
  displayName: "Session Matchups",
  version: "0.1.0",
  addedAt: "2026-09-13",
  description:
    "Session workspace step that assigns roster players to Team 1 and Team 2 per game, with swap, clear, copy previous, and optional winner.",
  sectionCategory: "workflow",
  purpose: "Persist game matchups from the session roster without using camera sides.",
  bestFor: ["session workspace matchups step", "copy previous matchup"],
  tone: ["utilitarian", "archive"],
  contentDensity: "high",
  visualWeight: "medium",
  layout: { type: "stack", alignment: "start" },
  slots: ["emptyRoster", "gameRow", "teamEditor", "winner"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["session", "matchup", "teams", "games", "admin", "workspace"],
  dependencies: ["@fe-template/ui", "next", "sonner"],
  registryDependencies: ["button", "card", "native-select"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
