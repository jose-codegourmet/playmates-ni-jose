import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "players-table",
  displayName: "Players Table",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Admin DataTable of players with client-side search, an archived toggle, create/edit dialog, and archive confirmation.",
  sectionCategory: "listing",
  purpose: "Let José create, edit, and archive reusable players without hard delete.",
  bestFor: ["players list", "roster setup"],
  tone: ["utilitarian", "archive"],
  contentDensity: "high",
  visualWeight: "medium",
  layout: { type: "table", alignment: "start" },
  slots: ["search", "showArchived", "table", "createDialog", "archiveConfirm"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["player", "table", "admin", "archive"],
  dependencies: ["@fe-template/ui", "@tanstack/react-table", "sonner", "next"],
  registryDependencies: ["data-table", "button", "empty", "switch", "dialog", "alert-dialog"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
