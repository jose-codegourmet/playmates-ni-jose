import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "game-detail-links",
  displayName: "Game Detail Links Section",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Public Drive and YouTube links for a game, grouped by provider.",
  sectionCategory: "detail",
  purpose: "Give visitors outbound provider links without showing private or empty URLs.",
  bestFor: ["game detail page"],
  tone: ["utilitarian", "archive"],
  contentDensity: "low",
  visualWeight: "low",
  layout: { type: "stack", alignment: "start" },
  slots: ["heading", "providerLinks"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["game", "links", "drive", "youtube"],
  dependencies: ["@fe-template/mocks"],
  registryDependencies: ["provider-link-list"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
