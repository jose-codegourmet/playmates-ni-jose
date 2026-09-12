import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "dashboard-widgets",
  displayName: "Dashboard Widgets",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Admin dashboard layout: 2×2 widget grid on desktop (stack on mobile) plus a full-width latest sessions table.",
  sectionCategory: "layout",
  purpose: "Compose the Playmates admin dashboard from mock-backed widgets.",
  bestFor: ["admin dashboard"],
  tone: ["utilitarian", "archive"],
  contentDensity: "high",
  visualWeight: "high",
  layout: { type: "grid", alignment: "start" },
  slots: ["unfinishedUploads", "failedJobs", "awaitingFacebook", "quickCreate", "latestSessions"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["dashboard", "layout", "session", "upload", "facebook"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks", "next"],
  registryDependencies: ["card", "empty", "table", "button", "badge"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
