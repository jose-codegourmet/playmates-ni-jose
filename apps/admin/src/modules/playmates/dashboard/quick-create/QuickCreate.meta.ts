import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "quick-create",
  displayName: "Quick Create",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Dashboard card with a button that starts a new session at /sessions/new.",
  sectionCategory: "form",
  purpose: "Give José a one-click path from the dashboard into session create.",
  bestFor: ["admin dashboard"],
  tone: ["utilitarian", "archive"],
  contentDensity: "low",
  visualWeight: "low",
  layout: { type: "stack", alignment: "start" },
  slots: ["copy", "cta"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["dashboard", "session", "create"],
  dependencies: ["@fe-template/ui", "next"],
  registryDependencies: ["card", "button"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
