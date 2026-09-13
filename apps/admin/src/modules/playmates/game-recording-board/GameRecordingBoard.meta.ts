import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "game-recording-board",
  displayName: "Game Recording Board",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Organize board with dnd-kit: unassigned recordings beside Side A / Side B lanes. Cards drag onto lanes.",
  sectionCategory: "workflow",
  purpose:
    "Let an admin assign recordings to a game and camera side by drag-and-drop or Move to… without a two-file rule.",
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
  registryDependencies: ["card", "empty", "recording-card", "camera-side-lane"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "fullscreen", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
