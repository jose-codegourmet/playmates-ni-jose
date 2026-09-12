import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "hero",
  displayName: "Players Hero Section",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Players index heading and archive description from PAGE_SEO.players.",
  sectionCategory: "hero",
  purpose: "Introduce the public players index.",
  bestFor: ["players index"],
  tone: ["utilitarian", "archive"],
  contentDensity: "low",
  visualWeight: "medium",
  layout: { type: "stack", alignment: "start" },
  slots: ["heading", "description"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: false,
    supportsDarkMode: true,
  },
  tags: ["players", "hero", "archive"],
  dependencies: ["next"],
  registryDependencies: [],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
