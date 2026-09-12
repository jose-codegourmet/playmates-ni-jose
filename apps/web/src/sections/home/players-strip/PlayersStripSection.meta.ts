import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "players-strip",
  displayName: "Players Strip Section",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Horizontal strip of public players who appear on published sessions.",
  sectionCategory: "listing",
  purpose: "Give visitors a quick path from home to player pages.",
  bestFor: ["home page"],
  tone: ["utilitarian", "archive"],
  contentDensity: "low",
  visualWeight: "low",
  layout: { type: "stack", alignment: "start" },
  slots: ["heading", "playerCards", "empty"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["home", "players", "cards"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks", "next"],
  registryDependencies: ["player-card", "empty"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
