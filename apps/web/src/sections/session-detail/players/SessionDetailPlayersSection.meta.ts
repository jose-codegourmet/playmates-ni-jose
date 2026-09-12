import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "players",
  displayName: "Session Detail Players Section",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "PlayerCard grid linking to /players/[slug] for a published session roster.",
  sectionCategory: "listing",
  purpose: "Let a visitor open each player who appeared in the session.",
  bestFor: ["session detail page"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
  visualWeight: "medium",
  layout: { type: "grid", alignment: "start" },
  slots: ["heading", "playerCards", "empty"],
  capabilities: {
    supportsImage: true,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["session", "players", "cards"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks", "next"],
  registryDependencies: ["player-card", "empty"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
