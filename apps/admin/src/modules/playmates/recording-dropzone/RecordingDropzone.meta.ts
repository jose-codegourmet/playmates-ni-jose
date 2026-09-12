import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "recording-dropzone",
  displayName: "Recording Dropzone",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Admin import drop zone that emits selected video files without uploading. Preview list is parent-controlled.",
  sectionCategory: "media",
  purpose:
    "Let an admin pick multiple session videos on Import without holding File state in the widget.",
  bestFor: ["session import step", "multi-video file pick"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
  visualWeight: "medium",
  layout: { type: "stack", alignment: "center" },
  slots: ["dropzone", "fileInput", "fileList"],
  capabilities: {
    supportsImage: false,
    supportsVideo: true,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["recording", "dropzone", "import", "video", "admin"],
  dependencies: ["@fe-template/ui", "lucide-react"],
  registryDependencies: ["button"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
