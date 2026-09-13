import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "game-recording-board",
  displayName: "Game Recording Board",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Organize board with dnd-kit: assign recordings to Side A / Side B, reorder parts, and remove empty games.",
  sectionCategory: "workflow",
  purpose:
    "Let an admin assign recordings to a game and camera side, reorder multi-part clips, and remove a game that has no recordings.",
  bestFor: ["session organize step", "recording assignment"],
  tone: ["utilitarian", "archive"],
  contentDensity: "high",
  visualWeight: "high",
  layout: { type: "board", alignment: "start" },
  slots: ["unassigned", "gameWorkspace", "sideA", "sideB"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: false,
    supportsDarkMode: true,
  },
  tags: ["recording", "organize", "game", "board", "admin"],
  dependencies: ["@fe-template/ui", "@dnd-kit/core", "@dnd-kit/sortable", "@dnd-kit/utilities"],
  registryDependencies: ["button", "card", "empty", "recording-card", "camera-side-lane"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "fullscreen", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
