import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "session-publish-checklist",
  displayName: "Session Publish Checklist",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Admin checklist of games for Review & Publish: matchup, YouTube and Drive state, visibility, and a non-blocking missing-provider warning.",
  sectionCategory: "workflow",
  purpose: "Let an admin scan each game and publish even when a provider asset is missing.",
  bestFor: ["session review and publish", "per-game publish actions"],
  tone: ["utilitarian", "archive"],
  contentDensity: "high",
  visualWeight: "medium",
  layout: { type: "stack", alignment: "start" },
  slots: ["matchup", "youtubeState", "driveState", "visibility", "warning", "publish"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["publish", "checklist", "session", "youtube", "drive", "visibility"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks"],
  registryDependencies: ["card", "button", "alert", "empty"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
