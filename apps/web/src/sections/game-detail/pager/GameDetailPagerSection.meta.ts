import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "game-detail-pager",
  displayName: "Game Detail Pager Section",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Previous and next links for adjacent public game numbers in the same session.",
  sectionCategory: "detail",
  purpose: "Move to the neighboring published game without exposing private games.",
  bestFor: ["game detail page"],
  tone: ["utilitarian", "archive"],
  contentDensity: "low",
  visualWeight: "low",
  layout: { type: "split", alignment: "between" },
  slots: ["previous", "next"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["game", "pager", "navigation"],
  dependencies: ["@fe-template/ui", "next"],
  registryDependencies: ["button"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
