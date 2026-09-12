import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "header",
  displayName: "Session Detail Header Section",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Public session header: date, title, venue, and notes. No admin status badges.",
  sectionCategory: "detail",
  purpose: "Identify a published session before listing players and games.",
  bestFor: ["session detail page"],
  tone: ["utilitarian", "archive"],
  contentDensity: "low",
  visualWeight: "medium",
  layout: { type: "stack", alignment: "start" },
  slots: ["date", "title", "venue", "notes"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: false,
    supportsDarkMode: true,
  },
  tags: ["session", "header", "archive"],
  dependencies: ["@fe-template/mocks"],
  registryDependencies: [],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
