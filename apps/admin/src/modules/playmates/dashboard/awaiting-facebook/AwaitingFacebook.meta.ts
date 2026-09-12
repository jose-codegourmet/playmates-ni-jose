import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "awaiting-facebook",
  displayName: "Awaiting Facebook",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Dashboard list of public games whose Facebook Group post draft has not been marked posted.",
  sectionCategory: "social",
  purpose: "Remind José which published games still need a Facebook Group post.",
  bestFor: ["admin dashboard", "publish follow-up"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
  visualWeight: "medium",
  layout: { type: "stack", alignment: "start" },
  slots: ["sessionDate", "gameNumber", "title"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["dashboard", "facebook", "post-draft"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks", "next"],
  registryDependencies: ["card", "empty"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
