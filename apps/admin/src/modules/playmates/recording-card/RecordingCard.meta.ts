import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "recording-card",
  displayName: "Recording Card",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Dense admin row for one imported recording: filename, size, duration, camera side, part, and organize status.",
  sectionCategory: "workflow",
  purpose:
    "Let an admin scan and move a recording on the Organize board via drag handle or Move to….",
  bestFor: ["organize board", "unassigned file list", "camera side lanes"],
  tone: ["utilitarian", "archive"],
  contentDensity: "high",
  visualWeight: "low",
  layout: { type: "stack", alignment: "start" },
  slots: [
    "dragHandle",
    "filename",
    "size",
    "duration",
    "cameraSide",
    "partNumber",
    "status",
    "moveTo",
  ],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: false,
    supportsDarkMode: true,
  },
  tags: ["recording", "card", "organize", "camera", "admin"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks", "lucide-react", "@dnd-kit/core"],
  registryDependencies: ["card", "badge", "button", "select", "status-badge"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
