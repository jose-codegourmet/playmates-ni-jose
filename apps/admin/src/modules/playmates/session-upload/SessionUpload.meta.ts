import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "session-upload",
  displayName: "Session Upload",
  version: "0.1.0",
  addedAt: "2026-09-13",
  description:
    "Session workspace Upload step: matrix and queue from mock jobs/assets, queue Drive/YouTube, and a reselect banner when File handles are gone.",
  sectionCategory: "workflow",
  purpose: "Show per-recording Drive and YouTube status and enqueue mock upload jobs.",
  bestFor: ["session workspace upload step"],
  tone: ["utilitarian", "archive"],
  contentDensity: "high",
  visualWeight: "medium",
  layout: { type: "table", alignment: "start" },
  slots: ["reselectBanner", "queueActions", "matrix", "queue"],
  capabilities: {
    supportsImage: false,
    supportsVideo: true,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["session", "upload", "drive", "youtube", "admin", "workspace"],
  dependencies: ["@fe-template/ui", "sonner", "lucide-react"],
  registryDependencies: ["alert", "button", "upload-matrix", "upload-queue"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
