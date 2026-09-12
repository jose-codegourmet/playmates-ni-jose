import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "games",
  displayName: "Player Detail Games Section",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Recent public games for one player, rendered as GameCards. No stats.",
  sectionCategory: "listing",
  purpose: "Let a visitor open published games this player appeared in.",
  bestFor: ["player detail page"],
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
  tags: ["player", "games", "cards"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks", "next"],
  registryDependencies: ["game-card", "empty"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
