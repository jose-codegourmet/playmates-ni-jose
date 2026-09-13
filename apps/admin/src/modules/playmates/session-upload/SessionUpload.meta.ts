import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "session-upload",
  displayName: "Session Upload",
  version: "0.1.0",
  addedAt: "2026-09-13",
  description:
    "Session workspace Upload step: matrix and queue from mock jobs/assets, per-row and bulk queue, 400ms job polling, independent retry/cancel/replace, and a reselect banner when File handles are gone.",
  sectionCategory: "workflow",
  purpose: "Queue mock Drive and YouTube jobs, poll progress, and show completed ProviderAsset URLs.",
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
  registryDependencies: ["alert", "alert-dialog", "button", "upload-matrix", "upload-queue"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
