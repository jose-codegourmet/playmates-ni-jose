import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "youtube-embed",
  displayName: "YouTube Embed",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Responsive 16:9 YouTube iframe for a published recording. Missing URLs stay quiet instead of rendering a broken frame.",
  sectionCategory: "media",
  purpose: "Play a published YouTube recording on public session and game pages.",
  bestFor: ["game detail", "session recording player"],
  tone: ["utilitarian", "archive"],
  contentDensity: "low",
  visualWeight: "high",
  layout: { type: "stack", alignment: "center" },
  slots: ["iframe", "empty"],
  capabilities: {
    supportsImage: false,
    supportsVideo: true,
    supportsForm: false,
    supportsCTA: false,
    supportsDarkMode: true,
  },
  tags: ["youtube", "embed", "video", "recording"],
  dependencies: ["@fe-template/ui", "@fe-template/mocks"],
  registryDependencies: ["aspect-ratio"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
