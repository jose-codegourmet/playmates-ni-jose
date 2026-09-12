import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "settings-index",
  displayName: "Settings Index",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Admin settings hub with cards that link to Google and Publishing placeholders.",
  sectionCategory: "listing",
  purpose: "Let José open Google OAuth and publishing defaults from Settings.",
  bestFor: ["admin settings index"],
  tone: ["utilitarian", "archive"],
  contentDensity: "low",
  visualWeight: "low",
  layout: { type: "grid", alignment: "start" },
  slots: ["googleLink", "publishingLink"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["settings", "admin", "google", "publishing"],
  dependencies: ["@fe-template/ui", "next"],
  registryDependencies: ["card", "button"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
