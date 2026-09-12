import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "hero",
  displayName: "Venues Hero Section",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Venues index heading and archive description from PAGE_SEO.venues.",
  sectionCategory: "hero",
  purpose: "Introduce the public venues index.",
  bestFor: ["venues index"],
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
  tags: ["venues", "hero", "archive"],
  dependencies: ["next"],
  registryDependencies: [],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
