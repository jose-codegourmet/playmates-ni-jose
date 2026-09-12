import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "recent-games",
  displayName: "Recent Games Section",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Home listing of the six most recent public games as GameCards.",
  sectionCategory: "listing",
  purpose: "Let a visitor open recently published games from the archive home.",
  bestFor: ["home page"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
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
  tags: ["home", "games", "cards"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks", "next"],
  registryDependencies: ["game-card", "empty"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
