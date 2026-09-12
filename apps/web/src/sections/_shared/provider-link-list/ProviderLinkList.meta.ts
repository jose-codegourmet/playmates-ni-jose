import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "provider-link-list",
  displayName: "Provider Link List",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Grouped public Google Drive and YouTube links for a session, game, or recording.",
  sectionCategory: "media",
  purpose: "Let visitors open published Drive and YouTube assets without dead hash links.",
  bestFor: ["game detail", "session detail", "recording public links"],
  tone: ["utilitarian", "archive"],
  contentDensity: "low",
  visualWeight: "low",
  layout: { type: "stack", alignment: "start" },
  slots: ["googleDrive", "youtube"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["provider", "youtube", "google-drive", "links"],
  dependencies: ["@fe-template/mocks"],
  registryDependencies: [],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
