import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "session-workspace-header",
  displayName: "Session Workspace Header",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Desktop-first admin header for a session workspace: date, title, venue, status, visibility, and save state.",
  sectionCategory: "workflow",
  purpose:
    "Show the current session identity and save/publish state while an admin works a session.",
  bestFor: ["session workspace chrome", "admin session editor"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
  visualWeight: "low",
  layout: { type: "split", alignment: "center" },
  slots: ["date", "title", "venue", "status", "visibility", "saveState"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: false,
    supportsDarkMode: true,
  },
  tags: ["session", "workspace", "header", "status", "visibility", "save"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks"],
  registryDependencies: ["badge"],
  a11y: { keyboardNav: false, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
