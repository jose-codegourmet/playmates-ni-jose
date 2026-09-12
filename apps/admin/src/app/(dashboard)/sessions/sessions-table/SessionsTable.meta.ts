import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "sessions-table",
  displayName: "Sessions Table",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Admin DataTable of sessions with all/draft/published filter chips, status and visibility badges, and Open to the workspace stub.",
  sectionCategory: "listing",
  purpose: "Let José scan every session, including private drafts, and open a workspace.",
  bestFor: ["sessions list", "admin archive"],
  tone: ["utilitarian", "archive"],
  contentDensity: "high",
  visualWeight: "medium",
  layout: { type: "table", alignment: "start" },
  slots: ["statusFilter", "table", "open"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["session", "table", "admin", "status", "visibility"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks", "@tanstack/react-table", "next"],
  registryDependencies: ["data-table", "button", "empty", "badge"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
