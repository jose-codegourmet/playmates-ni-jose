import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "filters",
  displayName: "Sessions Filters Section",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Client filters for the sessions index: date, public player, and venue.",
  sectionCategory: "form",
  purpose: "Let a visitor narrow published sessions in memory.",
  bestFor: ["sessions index"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
  visualWeight: "low",
  layout: { type: "stack", alignment: "start" },
  slots: ["date", "player", "venue", "reset"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: true,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["sessions", "filters", "player", "venue"],
  dependencies: ["@fe-template/ui"],
  registryDependencies: ["input", "label", "native-select", "button"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
