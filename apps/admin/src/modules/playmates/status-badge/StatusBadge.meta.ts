import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "status-badge",
  displayName: "Status Badge",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Maps session, game, recording, and upload-job statuses plus visibility onto @fe-template/ui Badge variants.",
  sectionCategory: "status",
  purpose: "Show publication, upload, and visibility state without inventing new badge colors.",
  bestFor: ["session workspace header", "upload matrix", "publish checklist", "session cards"],
  tone: ["utilitarian", "archive"],
  contentDensity: "low",
  visualWeight: "low",
  layout: { type: "stack", alignment: "start" },
  slots: ["status", "visibility"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: false,
    supportsDarkMode: true,
  },
  tags: ["status", "badge", "visibility", "session", "game", "recording", "upload"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks"],
  registryDependencies: ["badge"],
  a11y: { keyboardNav: false, reducedMotion: true },
  preview: { layout: "center", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
