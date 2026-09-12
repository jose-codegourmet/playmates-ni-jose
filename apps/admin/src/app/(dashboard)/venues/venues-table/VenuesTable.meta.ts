import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "venues-table",
  displayName: "Venues Table",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Admin DataTable of venues with name, slug, court count, archived state, create/edit dialog, and archive confirmation.",
  sectionCategory: "listing",
  purpose: "Let José create, edit, and archive venues and open a venue to manage courts.",
  bestFor: ["venues list", "court setup"],
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
  tags: ["venue", "table", "admin", "archive"],
  dependencies: ["@fe-template/ui", "@tanstack/react-table", "sonner", "next"],
  registryDependencies: ["data-table", "button", "empty", "switch", "dialog", "alert-dialog"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
