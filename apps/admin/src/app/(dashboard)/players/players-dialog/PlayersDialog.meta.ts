import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "players-dialog",
  displayName: "Players Dialog",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Modal wrapper for creating or editing a player from the admin Players list.",
  sectionCategory: "form",
  purpose: "Keep create and edit on the list page without a separate detail route.",
  bestFor: ["players list", "inline add player"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
  visualWeight: "medium",
  layout: { type: "stack", alignment: "start" },
  slots: ["title", "description", "form"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: true,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["player", "dialog", "admin"],
  dependencies: ["@fe-template/ui"],
  registryDependencies: ["dialog"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
