import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "matchup-label",
  displayName: "Matchup Label",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Presentational Team 1 vs Team 2 label for a game, using formatMatchup from mocks.",
  sectionCategory: "listing",
  purpose: "Render a doubles or singles matchup string without reimplementing naming rules.",
  bestFor: ["game cards", "game detail", "session listings"],
  tone: ["utilitarian", "archive"],
  contentDensity: "low",
  visualWeight: "low",
  layout: { type: "stack", alignment: "start" },
  slots: ["team1", "team2"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: false,
    supportsDarkMode: true,
  },
  tags: ["matchup", "players", "game"],
  dependencies: ["@fe-template/mocks"],
  registryDependencies: [],
  a11y: { keyboardNav: false, reducedMotion: true },
  preview: { layout: "center", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
