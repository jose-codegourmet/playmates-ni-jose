import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "upload-provider-status",
  displayName: "Upload Provider Status",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Admin cell for one provider upload job: Drive or YouTube status, progress while in flight, and failed error text.",
  sectionCategory: "status",
  purpose: "Show per-provider upload progress and failures without hiding errors.",
  bestFor: ["upload matrix", "upload queue", "session workspace upload step"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
  visualWeight: "low",
  layout: { type: "stack", alignment: "start" },
  slots: ["provider", "status", "progress", "error"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: false,
    supportsDarkMode: true,
  },
  tags: ["upload", "provider", "drive", "youtube", "progress", "admin"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks"],
  registryDependencies: ["progress", "status-badge"],
  a11y: { keyboardNav: false, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
