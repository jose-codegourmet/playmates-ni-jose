import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "game-card",
  displayName: "Game Card",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Public or admin card for one game: number, matchup, recording count, provider actions.",
  sectionCategory: "listing",
  purpose: "Let a visitor or admin scan a session’s games and open the detail.",
  bestFor: ["session detail game list", "home recent games"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
  visualWeight: "medium",
  layout: { type: "stack", alignment: "start" },
  slots: ["gameNumber", "matchup", "videoCount", "youtubeAction", "driveAction"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["game", "card", "session", "youtube", "drive"],
  dependencies: ["@fe-template/ui", "next"],
  registryDependencies: ["card", "badge", "button"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
