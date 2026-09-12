import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "player-form",
  displayName: "Player Form",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Create and edit a player with a required display name plus optional nickname, Facebook identity, and notes.",
  sectionCategory: "form",
  purpose: "Collect player identity fields for the admin Players CRUD dialog.",
  bestFor: ["player create dialog", "player edit dialog", "workspace add-player"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
  visualWeight: "low",
  layout: { type: "stack", alignment: "start" },
  slots: ["displayName", "nickname", "facebookName", "facebookUrl", "notes"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: true,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["player", "form", "admin"],
  dependencies: ["@fe-template/ui", "react-hook-form", "zod", "@hookform/resolvers", "sonner"],
  registryDependencies: ["form", "input", "textarea", "button"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
