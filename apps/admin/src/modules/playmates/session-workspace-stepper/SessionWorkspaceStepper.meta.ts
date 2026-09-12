import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "session-workspace-stepper",
  displayName: "Session Workspace Stepper",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Ordered admin stepper for the session workspace: Details, Players, Import, Organize, Matchups, Upload, Review. Every step stays clickable.",
  sectionCategory: "workflow",
  purpose:
    "Let an admin jump between workspace steps, including completed and future steps, without blocking navigation.",
  bestFor: ["session workspace chrome", "multi-step session editor"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
  visualWeight: "low",
  layout: { type: "stack", alignment: "start" },
  slots: ["current", "completed", "href"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["session", "workspace", "stepper", "navigation", "admin"],
  dependencies: ["@fe-template/ui"],
  registryDependencies: ["badge"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
