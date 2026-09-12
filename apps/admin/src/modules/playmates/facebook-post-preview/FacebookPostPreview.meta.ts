import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "facebook-post-preview",
  displayName: "Facebook Post Preview",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Admin textarea for a Facebook Group draft body with a clipboard copy action. Does not generate the body or call Graph API.",
  sectionCategory: "social",
  purpose: "Let an admin review, edit, and copy a Facebook draft produced upstream.",
  bestFor: ["session publish review", "game Facebook draft"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
  visualWeight: "low",
  layout: { type: "stack", alignment: "start" },
  slots: ["title", "body", "copy"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["facebook", "preview", "clipboard", "publish"],
  dependencies: ["@fe-template/ui"],
  registryDependencies: ["textarea", "button", "label"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
