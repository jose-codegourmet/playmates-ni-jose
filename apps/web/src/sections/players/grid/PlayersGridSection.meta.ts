import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "grid",
  displayName: "Players Grid Section",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Grid of PlayerCards for public-facing players who appear on a published session or game.",
  sectionCategory: "listing",
  purpose: "Show published players and open a player detail.",
  bestFor: ["players index"],
  tone: ["utilitarian", "archive"],
  contentDensity: "high",
  visualWeight: "medium",
  layout: { type: "grid", alignment: "start" },
  slots: ["playerCards", "empty"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["players", "grid", "cards"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks", "next"],
  registryDependencies: ["player-card", "empty"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
