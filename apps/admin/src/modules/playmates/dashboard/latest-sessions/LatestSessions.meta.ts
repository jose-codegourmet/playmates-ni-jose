import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "latest-sessions",
  displayName: "Latest Sessions",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Admin dashboard table of the five most recent sessions with date, status, visibility, and a workspace link.",
  sectionCategory: "listing",
  purpose: "Let an admin jump into a recent session workspace from the dashboard.",
  bestFor: ["admin dashboard", "session triage"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
  visualWeight: "medium",
  layout: { type: "table", alignment: "start" },
  slots: ["date", "status", "visibility", "workspaceLink"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["dashboard", "session", "status", "visibility"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks", "next"],
  registryDependencies: ["card", "empty", "table", "badge"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
