import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "grid",
  displayName: "Venues Grid Section",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Grid of VenueCards for venues that host at least one published session.",
  sectionCategory: "listing",
  purpose: "Show published courts and open a venue detail.",
  bestFor: ["venues index"],
  tone: ["utilitarian", "archive"],
  contentDensity: "high",
  visualWeight: "medium",
  layout: { type: "grid", alignment: "start" },
  slots: ["venueCards", "empty"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["venues", "grid", "cards"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks", "next"],
  registryDependencies: ["venue-card", "empty"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
