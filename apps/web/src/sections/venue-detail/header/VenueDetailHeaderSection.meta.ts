import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "header",
  displayName: "Venue Detail Header Section",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Public venue header: name, address, and optional notes.",
  sectionCategory: "detail",
  purpose: "Identify a court before listing its published session history.",
  bestFor: ["venue detail page"],
  tone: ["utilitarian", "archive"],
  contentDensity: "low",
  visualWeight: "medium",
  layout: { type: "stack", alignment: "start" },
  slots: ["eyebrow", "name", "address", "notes", "backLink"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["venue", "header", "archive"],
  dependencies: ["next"],
  registryDependencies: [],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
