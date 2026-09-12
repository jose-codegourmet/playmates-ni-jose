import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "upload-matrix",
  displayName: "Upload Matrix",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Admin table of per-recording Google Drive and YouTube upload statuses for the session workspace upload step.",
  sectionCategory: "workflow",
  purpose:
    "Scan Drive and YouTube jobs in a Recording | Drive | YouTube matrix without hiding failed cells.",
  bestFor: ["session workspace upload step", "upload progress table"],
  tone: ["utilitarian", "archive"],
  contentDensity: "high",
  visualWeight: "low",
  layout: { type: "table", alignment: "start" },
  slots: ["recordingLabel", "drive", "youtube"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: false,
    supportsDarkMode: true,
  },
  tags: ["upload", "matrix", "drive", "youtube", "admin"],
  dependencies: ["@fe-template/ui"],
  registryDependencies: ["table", "upload-provider-status"],
  a11y: { keyboardNav: false, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
