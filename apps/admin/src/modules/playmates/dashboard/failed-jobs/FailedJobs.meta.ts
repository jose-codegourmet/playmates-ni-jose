import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "failed-jobs",
  displayName: "Failed Jobs",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Dashboard list of failed upload jobs with provider and error code.",
  sectionCategory: "status",
  purpose: "Call out upload failures that need a retry or a file reselect.",
  bestFor: ["admin dashboard", "upload triage"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
  visualWeight: "medium",
  layout: { type: "stack", alignment: "start" },
  slots: ["recording", "provider", "status", "errorCode"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["dashboard", "upload", "error"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks", "next"],
  registryDependencies: ["card", "empty", "badge"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
