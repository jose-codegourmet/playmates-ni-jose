import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "game-team-editor",
  displayName: "Game Team Editor",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Controlled admin widget for assigning a session roster into Team 1 and Team 2, with swap, clear, and copy-previous actions.",
  sectionCategory: "workflow",
  purpose:
    "Let an admin set a game matchup from the session roster without inferring teams from camera sides.",
  bestFor: ["session matchups step", "game assignment", "copy previous matchup"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
  visualWeight: "medium",
  layout: { type: "split", alignment: "start" },
  slots: ["team1", "team2", "roster-select", "matchup-preview"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["game", "team", "matchup", "roster", "players", "admin"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks"],
  registryDependencies: ["button", "card", "native-select"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
