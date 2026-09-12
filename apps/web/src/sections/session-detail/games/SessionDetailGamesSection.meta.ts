import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "games",
  displayName: "Session Detail Games Section",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Ordered GameCard list for every public game in a published session.",
  sectionCategory: "listing",
  purpose: "Let a visitor scan matchups and open a game from the session.",
  bestFor: ["session detail page"],
  tone: ["utilitarian", "archive"],
  contentDensity: "high",
  visualWeight: "medium",
  layout: { type: "grid", alignment: "start" },
  slots: ["heading", "gameCards", "empty"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["session", "games", "cards"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks", "next"],
  registryDependencies: ["game-card", "empty"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
