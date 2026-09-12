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
    "Let an admin scan unassigned or assigned files on the Organize screen before drag-and-drop lands.",
  bestFor: ["organize board", "unassigned file list", "camera side lanes"],
  tone: ["utilitarian", "archive"],
  contentDensity: "high",
  visualWeight: "low",
  layout: { type: "stack", alignment: "start" },
  slots: ["dragHandle", "filename", "size", "duration", "cameraSide", "partNumber", "status"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: false,
    supportsDarkMode: true,
  },
  tags: ["recording", "card", "organize", "camera", "admin"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks", "lucide-react"],
  registryDependencies: ["card", "badge", "button", "status-badge"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
