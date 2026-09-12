import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "hero",
  displayName: "Home Hero Section",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Archive home hero: product name, one sentence, Browse sessions CTA, optional JabKit count-up.",
  sectionCategory: "hero",
  purpose: "Introduce the public archive and send visitors to published sessions.",
  bestFor: ["home page"],
  tone: ["utilitarian", "archive"],
  contentDensity: "low",
  visualWeight: "high",
  layout: { type: "stack", alignment: "center" },
  slots: ["headline", "description", "cta", "counts"],
  capabilities: {
    supportsImage: true,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["home", "hero", "sessions", "archive"],
  dependencies: ["@fe-template/ui", "next"],
  registryDependencies: ["hero228", "count-up", "button"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "fullscreen", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
