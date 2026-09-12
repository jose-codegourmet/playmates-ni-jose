import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "google-settings",
  displayName: "Google Settings",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Placeholder Google connection card with a disabled Connect Google button. Does not start OAuth.",
  sectionCategory: "status",
  purpose: "Show that Google Drive and YouTube OAuth is not wired yet.",
  bestFor: ["admin settings google page"],
  tone: ["utilitarian", "archive"],
  contentDensity: "low",
  visualWeight: "low",
  layout: { type: "stack", alignment: "start" },
  slots: ["copy", "connectButton"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["settings", "google", "oauth", "admin"],
  dependencies: ["@fe-template/ui"],
  registryDependencies: ["card", "button"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
