import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "venue-card",
  displayName: "Venue Card",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Compact public venues-index card: venue name, optional address, and published session count.",
  sectionCategory: "listing",
  purpose:
    "Let a visitor scan published courts and open a venue detail from the smallest listing card.",
  bestFor: ["venues index", "home venue access"],
  tone: ["utilitarian", "archive"],
  contentDensity: "low",
  visualWeight: "low",
  layout: { type: "stack", alignment: "start" },
  slots: ["name", "address", "sessionCount"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["venue", "card", "sessions"],
  dependencies: ["@fe-template/ui", "next"],
  registryDependencies: ["card", "badge"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
