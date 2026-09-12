import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "publishing-settings-form",
  displayName: "Publishing Settings Form",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Admin form for Facebook Group URL and default hashtags persisted on the mock settings bag.",
  sectionCategory: "form",
  purpose: "Let José set Facebook copy defaults used by the Facebook body generator.",
  bestFor: ["admin settings publishing page"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
  visualWeight: "low",
  layout: { type: "stack", alignment: "start" },
  slots: ["facebookGroupUrl", "defaultHashtags"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: true,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["settings", "facebook", "hashtags", "admin"],
  dependencies: ["@fe-template/ui", "react-hook-form", "zod", "@hookform/resolvers", "sonner"],
  registryDependencies: ["card", "form", "input", "button"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
