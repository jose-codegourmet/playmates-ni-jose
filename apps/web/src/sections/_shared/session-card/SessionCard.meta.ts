import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "session-card",
  displayName: "Session Card",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Public sessions-index card: date, optional title and venue, game count, players, and optional thumbnail.",
  sectionCategory: "listing",
  purpose: "Let a visitor scan published sessions and open a session detail.",
  bestFor: ["sessions index", "home recent sessions"],
  tone: ["utilitarian", "archive"],
  contentDensity: "high",
  visualWeight: "medium",
  layout: { type: "stack", alignment: "start" },
  slots: ["thumbnail", "date", "title", "venue", "gameCount", "players"],
  capabilities: {
    supportsImage: true,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["session", "card", "players", "venue"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks", "next"],
  registryDependencies: ["card", "badge"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
