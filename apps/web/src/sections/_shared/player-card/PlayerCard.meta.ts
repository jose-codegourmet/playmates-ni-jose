import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "player-card",
  displayName: "Player Card",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Public players-index card: initials avatar, display name, optional nickname and session count, muted when archived.",
  sectionCategory: "listing",
  purpose:
    "Let a visitor scan published players and open a player detail without hiding archived seed players.",
  bestFor: ["players index", "home player access"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
  visualWeight: "medium",
  layout: { type: "stack", alignment: "start" },
  slots: ["avatar", "displayName", "nickname", "sessionCount", "archived"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["player", "card", "avatar", "archive"],
  dependencies: ["@fe-template/ui", "next"],
  registryDependencies: ["card", "badge", "avatar"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
