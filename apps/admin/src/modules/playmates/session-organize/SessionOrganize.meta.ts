import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "session-organize",
  displayName: "Session Organize",
  version: "0.1.0",
  addedAt: "2026-09-13",
  description:
    "Session workspace Organize step: maps session recordings and games onto GameRecordingBoard and persists lane assigns.",
  sectionCategory: "workflow",
  purpose: "Assign recordings to game/camera lanes from the mock store via drag or Move to….",
  bestFor: ["session workspace organize step"],
  tone: ["utilitarian", "archive"],
  contentDensity: "high",
  visualWeight: "high",
  layout: { type: "board", alignment: "start" },
  slots: ["toolbar", "unassigned", "gameWorkspace"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["session", "organize", "recording", "board", "admin", "workspace"],
  dependencies: ["@fe-template/ui", "@dnd-kit/core"],
  registryDependencies: ["button", "game-recording-board"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "fullscreen", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
