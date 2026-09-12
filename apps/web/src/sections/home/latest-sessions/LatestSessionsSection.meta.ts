import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "latest-sessions",
  displayName: "Latest Sessions Section",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Home listing of the three most recent public sessions as SessionCards.",
  sectionCategory: "listing",
  purpose: "Let a visitor open the newest published sessions from the archive home.",
  bestFor: ["home page"],
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
  tags: ["home", "sessions", "cards"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks", "next"],
  registryDependencies: ["session-card", "empty"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
