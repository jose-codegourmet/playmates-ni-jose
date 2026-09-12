import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "game-detail-recordings",
  displayName: "Game Detail Recordings Section",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Ordered public recordings grouped by camera side, then part number. Embeds YouTube when an embed URL exists.",
  sectionCategory: "media",
  purpose: "Play or open each published recording in sequence without empty side groups.",
  bestFor: ["game detail page"],
  tone: ["utilitarian", "archive"],
  contentDensity: "high",
  visualWeight: "high",
  layout: { type: "stack", alignment: "start" },
  slots: ["sideGroups", "parts", "embed", "driveFallback", "empty"],
  capabilities: {
    supportsImage: false,
    supportsVideo: true,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["game", "recordings", "youtube", "archive"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks"],
  registryDependencies: ["youtube-embed", "empty"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
