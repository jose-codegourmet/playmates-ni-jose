import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "header",
  displayName: "Player Detail Header Section",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Public player header: display name and nickname. No stats or teammate graph.",
  sectionCategory: "detail",
  purpose: "Identify a public player before listing recent sessions and games.",
  bestFor: ["player detail page"],
  tone: ["utilitarian", "archive"],
  contentDensity: "low",
  visualWeight: "medium",
  layout: { type: "stack", alignment: "start" },
  slots: ["eyebrow", "avatar", "displayName", "nickname", "backLink"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["player", "header", "archive"],
  dependencies: ["@fe-template/ui", "next"],
  registryDependencies: ["avatar"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
