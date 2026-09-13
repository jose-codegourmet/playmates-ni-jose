import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "session-review-publish",
  displayName: "Session Review Publish",
  version: "0.1.0",
  addedAt: "2026-09-13",
  description:
    "Session workspace Review & Publish step: checklist of games, Facebook draft previews, and publish/visibility actions.",
  sectionCategory: "workflow",
  purpose:
    "Let an admin scan provider gaps, copy Facebook drafts, and persist game or session publish state.",
  bestFor: ["session workspace review and publish step"],
  tone: ["utilitarian", "archive"],
  contentDensity: "high",
  visualWeight: "medium",
  layout: { type: "stack", alignment: "start" },
  slots: ["sessionActions", "checklist", "facebookDrafts", "visibility"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["session", "publish", "facebook", "checklist", "admin", "workspace"],
  dependencies: ["@fe-template/ui", "sonner"],
  registryDependencies: [
    "button",
    "card",
    "native-select",
    "session-publish-checklist",
    "facebook-post-preview",
  ],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
