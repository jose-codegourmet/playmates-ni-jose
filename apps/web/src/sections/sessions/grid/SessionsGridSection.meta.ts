import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "grid",
  displayName: "Sessions Grid Section",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Grid of SessionCards for published sessions, with an Empty state when none match.",
  sectionCategory: "listing",
  purpose: "Show filtered public sessions and open a session detail.",
  bestFor: ["sessions index"],
  tone: ["utilitarian", "archive"],
  contentDensity: "high",
  visualWeight: "medium",
  layout: { type: "grid", alignment: "start" },
  slots: ["sessionCards", "empty"],
  capabilities: {
    supportsImage: true,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["sessions", "grid", "cards"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks", "next"],
  registryDependencies: ["session-card", "empty"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
