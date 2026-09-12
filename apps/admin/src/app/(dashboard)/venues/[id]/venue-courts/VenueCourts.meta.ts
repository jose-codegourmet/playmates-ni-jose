import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "venue-courts",
  displayName: "Venue Courts",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Venue detail courts list with add-court form, archive confirmation, and an archived toggle.",
  sectionCategory: "detail",
  purpose: "Let José add and archive courts that belong to one venue.",
  bestFor: ["venue detail", "court management"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
  visualWeight: "medium",
  layout: { type: "table", alignment: "start" },
  slots: ["heading", "addForm", "showArchived", "table", "archiveConfirm"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: true,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["venue", "court", "table", "admin", "archive"],
  dependencies: ["@fe-template/ui", "@tanstack/react-table", "sonner", "next"],
  registryDependencies: ["data-table", "button", "empty", "switch", "alert-dialog"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
