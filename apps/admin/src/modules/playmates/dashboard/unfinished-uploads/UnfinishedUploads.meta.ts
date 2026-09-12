import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "unfinished-uploads",
  displayName: "Unfinished Uploads",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Dashboard list of upload jobs that are not completed or cancelled, including failed in-progress work.",
  sectionCategory: "status",
  purpose: "Surface recordings that still need Drive or YouTube work.",
  bestFor: ["admin dashboard", "upload triage"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
  visualWeight: "medium",
  layout: { type: "stack", alignment: "start" },
  slots: ["recording", "provider", "status"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["dashboard", "upload", "job"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks", "next"],
  registryDependencies: ["card", "empty", "badge"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
