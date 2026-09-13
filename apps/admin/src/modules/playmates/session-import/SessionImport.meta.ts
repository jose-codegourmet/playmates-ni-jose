import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "session-import",
  displayName: "Session Import",
  version: "0.1.0",
  addedAt: "2026-09-13",
  description:
    "Session workspace Import step: dropzone, metadata persist via recordings.createMany, and per-row Reselect after refresh.",
  sectionCategory: "workflow",
  purpose:
    "Import local video metadata into a session while keeping File objects in client state only.",
  bestFor: ["session workspace import step"],
  tone: ["utilitarian", "archive"],
  contentDensity: "high",
  visualWeight: "medium",
  layout: { type: "table", alignment: "start" },
  slots: ["banner", "dropzone", "table", "reselect"],
  capabilities: {
    supportsImage: false,
    supportsVideo: true,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["session", "import", "recording", "admin", "workspace"],
  dependencies: ["@fe-template/ui", "sonner"],
  registryDependencies: ["alert", "badge", "button", "data-table"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
