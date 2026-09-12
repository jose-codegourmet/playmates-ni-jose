import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "hero",
  displayName: "Sessions Hero Section",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Sessions index heading and archive description from PAGE_SEO.sessions.",
  sectionCategory: "hero",
  purpose: "Introduce the public sessions index.",
  bestFor: ["sessions index"],
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
  tags: ["sessions", "hero", "archive"],
  dependencies: ["next"],
  registryDependencies: [],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
