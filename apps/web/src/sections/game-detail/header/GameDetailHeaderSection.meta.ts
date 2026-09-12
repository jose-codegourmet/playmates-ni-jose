import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "game-detail-header",
  displayName: "Game Detail Header Section",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Public game header: matchup, session date, venue, and a link back to the session.",
  sectionCategory: "detail",
  purpose: "Identify a published game and return the visitor to its session.",
  bestFor: ["game detail page"],
  tone: ["utilitarian", "archive"],
  contentDensity: "low",
  visualWeight: "medium",
  layout: { type: "stack", alignment: "start" },
  slots: ["gameNumber", "matchup", "date", "venue", "sessionLink"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["game", "header", "matchup", "archive"],
  dependencies: ["@fe-template/mocks", "next"],
  registryDependencies: ["matchup-label"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
