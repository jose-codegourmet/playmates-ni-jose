import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "sessions",
  displayName: "Player Detail Sessions Section",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Recent public sessions for one player, rendered as SessionCards.",
  sectionCategory: "listing",
  purpose: "Let a visitor open published sessions this player appeared in.",
  bestFor: ["player detail page"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
  visualWeight: "medium",
  layout: { type: "grid", alignment: "start" },
  slots: ["heading", "sessionCards", "empty"],
  capabilities: {
    supportsImage: true,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["player", "sessions", "cards"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks", "next"],
  registryDependencies: ["session-card", "empty"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
