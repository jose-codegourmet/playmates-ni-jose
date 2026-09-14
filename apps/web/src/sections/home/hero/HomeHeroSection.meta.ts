import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "hero",
  displayName: "Home Hero Section",
  version: "0.2.0",
  addedAt: "2026-09-12",
  description:
    "Calendar-first archive with day, week, and month views, session and game dialogs, and per-camera YouTube playback.",
  sectionCategory: "hero",
  purpose: "Browse public badminton sessions by date and watch each court view.",
  bestFor: ["home page"],
  tone: ["utilitarian", "archive"],
  contentDensity: "low",
  visualWeight: "high",
  layout: { type: "stack", alignment: "center" },
  slots: ["calendar", "sessions", "games", "recordings"],
  capabilities: {
    supportsImage: true,
    supportsVideo: true,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["home", "hero", "sessions", "archive"],
  dependencies: ["@fe-template/ui", "next"],
  registryDependencies: ["fullscreen-calendar", "button"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "fullscreen", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
