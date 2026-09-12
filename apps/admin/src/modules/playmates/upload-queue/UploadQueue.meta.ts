import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "upload-queue",
  displayName: "Upload Queue",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Admin list of recordings with stacked Google Drive and YouTube upload statuses for the session workspace upload step.",
  sectionCategory: "workflow",
  purpose:
    "Scan per-recording provider jobs in a quiet stacked list, including empty and failed states.",
  bestFor: ["session workspace upload step", "upload progress list"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
  visualWeight: "low",
  layout: { type: "stack", alignment: "start" },
  slots: ["recordingLabel", "drive", "youtube"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: false,
    supportsDarkMode: true,
  },
  tags: ["upload", "queue", "drive", "youtube", "admin"],
  dependencies: ["@fe-template/ui"],
  registryDependencies: ["card", "empty", "upload-provider-status"],
  a11y: { keyboardNav: false, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
